import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import { Font } from '@react-pdf/renderer'
import SegoeUI from "../../public/fonts/SegoeUI.ttf"
import SegoeUIBold from "../../public/fonts/SegoeUIBold.ttf"
import { DocumentData } from 'firebase/firestore';


Font.registerHyphenationCallback(word => [word]);


Font.register({
    family: 'SegoeUI', fonts: [
        { src: SegoeUI }, { src: SegoeUIBold, fontStyle: 'normal', fontWeight: "bold" },
        /*  { src: source2, fontStyle: 'italic' },
         { src: source3, fontStyle: 'italic', fontWeight: 700 }, */
    ]
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4'
    },
    headerSection: {
        /* position: 'absolute',
        bottom: 0,
        left: 0, */
        display: "flex",
        flexDirection: "row",
        "backgroundColor": '#20314b',
        width: "100vw",
        height: "65px",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
    },
    headerText: {
        margin: "auto",
        fontSize: 20,
        fontFamily: "SegoeUI",

        color: "white",

    },
    pageNumbers: {
        position: "absolute",
        top: 15,
        right: 40,
        fontSize: 10,
        color: "white",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

interface BuildingDetails {
    id?: string,
    name?: string,
    name_lowerCase?: string,
    address?: string,
    buildingsLogo?: string,
    contactEmail?: string,
    contactMobile?: string,
    contactName?: string,
    contactOffice?: string,
    images?: string[],
    landlord?: string,
    landlordId?: string,
    lastUpdated?: string   //Date.now().toISOString()
    parkingRatio?: number,
    province?: string,
    rentalHigh?: number,
    rentalLow?: number,
    suburb?: string,
    suburb_lowerCase?: string,
    type?: string,
    vacantGLA?: number,
    premises: Premises[]

}

interface Premises {
    id: string,
    name: string,
    vacant: boolean,
    floor: string,
    type: string,
    area: number,
    netRental: number,
    opCosts: number,
    otherRental: number,
    grossRental: number,
    openBays: number,
    openRate: number,
    openRatio: number,
    coveredBays: number,
    coveredRate: number,
    coveredRatio: number,
    shadedBays: number,
    shadedRate: number,
    shadedRatio: number,
    parkingRatio: number,
    selected: boolean,
}

type SelectedBuildings = BuildingDetails[] | DocumentData

interface Props {
    previewPDFData: DocumentData
}


const SavedListPDF: React.FC<Props> = ({ previewPDFData }) => (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
            <View fixed style={styles.headerSection}>
                <Text style={styles.headerText}>{previewPDFData.title}</Text>
                <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />

            </View>

            {previewPDFData.buildings.map((building: BuildingDetails, index: number) => (
                <View style={styles.section}>
                    <Text>{building.name}</Text>
                </View>

            ))}

        </Page>
    </Document>
);

export default SavedListPDF