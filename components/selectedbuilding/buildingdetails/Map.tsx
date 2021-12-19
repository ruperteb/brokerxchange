import React, { useRef, useEffect, useState } from 'react';
import styled from "@emotion/styled"

import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

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

const StyledSidebar = styled.div`
background-color: rgba(35, 55, 75, 0.9);
color: #fff;
padding: 6px 12px;
font-family: monospace;
z-index: 1;
/* position: absolute; */
top: 0;
left: 0;
margin: 12px;
border-radius: 4px;
`

const Test = styled.div`
height: 20px;
width: 20px;
background-color: red;
`

interface Props {
    mapDivDimensions: { width: number | undefined, height: number | undefined },
    latMap: number,
    lngMap: number
}

export const Map: React.FunctionComponent<Props> = ({ mapDivDimensions, latMap, lngMap }) => {

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
        marker.current = new mapboxgl.Marker(/* el */)
            .setLngLat([lng, lat])
            .addTo(map.current);

    }, [lng, lat])



    return (
        <div>
            {/* <StyledSidebar>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </StyledSidebar> */}
            <StyledMapDiv width={mapDivDimensions.width} height={mapDivDimensions.height} ref={mapContainer} />
        </div>
    )
}

export default Map