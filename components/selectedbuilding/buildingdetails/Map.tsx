import React, { useRef, useEffect, useState } from 'react';
import styled from "@emotion/styled"

import IconButton from '@mui/material/IconButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { db } from "../../../utils/firebaseClient"
import { updateDoc, doc } from "firebase/firestore";


mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

interface MapDivDimensions {
    width: number | undefined,
    height: number | undefined
}

const StyledMapDiv = styled.div<MapDivDimensions>`
height: ${props => props.height}px;
width: ${props => props.width}px;
position: relative;
&&& .mapboxgl-canvas {
    padding: 0.5rem;
}

`

const StyledSaveButton = styled(IconButton)`
position: absolute;
top: 1rem;
right: 1rem;
background-color: #ffffffab;
&:hover {
    background-color: #0000ff21;
}

`




interface Props {
    mapDivDimensions: { width: number | undefined, height: number | undefined },
    latMap: number,
    lngMap: number,
    id: string
}

export const Map: React.FunctionComponent<Props> = ({ mapDivDimensions, latMap, lngMap, id }) => {

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const marker = useRef<any>(null);
    const [lng, setLng] = useState(lngMap);
    const [lat, setLat] = useState(latMap);
    const [zoom, setZoom] = useState(12);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

    });

    useEffect(() => {
        map.current.resize()
    }, [mapDivDimensions])

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    /* const el = document.createElement('div');
    el.style.backgroundColor = "red";
    el.style.width = "20px";
    el.style.height = "20px"; */

    useEffect(() => {
        if (marker.current) return;
        marker.current = new mapboxgl.Marker({/* el */draggable: true })
            .setLngLat([lng, lat])
            .addTo(map.current);

    }, [lng, lat])

    const onDragEnd = () => {
        const lngLat = marker.current.getLngLat();
        setMarketLngLat({
            lng: lngLat.lng,
            lat: lngLat.lat
        })
    }

    useEffect(() => {
        if (!marker.current) return; // wait for map to initialize
        marker.current.on('dragend', onDragEnd);
    });

    interface MarkerLngLat {
        lng: number,
        lat: number
    }

    const [markerLngLat, setMarketLngLat] = React.useState<MarkerLngLat>()

    const saveCoordinates = async () => {

        const docRef = doc(db, "buildings", id);
        if (markerLngLat)
            await updateDoc(docRef, {
                lng: markerLngLat?.lng,
                lat: markerLngLat?.lat,
            })
    }

    return (
        <div style={{ position: "relative" }}>
            <StyledMapDiv width={mapDivDimensions.width} height={mapDivDimensions.height} ref={mapContainer} />
            <StyledSaveButton onClick={saveCoordinates} color="primary" aria-label="save" >
                <SaveOutlinedIcon />
            </StyledSaveButton>
        </div>
    )
}

export default Map