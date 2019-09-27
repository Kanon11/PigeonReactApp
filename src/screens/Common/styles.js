// - Import react components
import { StyleSheet } from 'react-native'
import { white } from 'ansi-colors';

const styles = StyleSheet.create({
    post: { margin: 0 },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    name: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        paddingTop: 5,
        paddingBottom: 10
    },
    nameText: {
        textAlign: 'justify',
        borderRightWidth: 30,
    },
    dateText: {
        fontSize: 10
    },
    body: {
        padding: 10
    },
    bodyText: {
        fontWeight: '100'
    },
    footer: {
        flexDirection: 'row',
        marginTop: 10,
        // flex: 1
    },
    footerLeft: {
        flexDirection: 'row',
        flex: 1
    },
    favorite: {
        width: 33,
        height: 33
    },
    favoriteIcon: {
        color: '#757575',
        margin: 7,
        backgroundColor: "transparent"
    },
    footerRight: {
        flexDirection: 'row'
    },
    comment: {
        width: 33,
        height: 33
    },
    commentIcon: {
        color: '#757575',
        margin: 7,
        backgroundColor: "transparent"
    },
    share: {
        width: 33,
        height: 33,
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    shareIcon: {
        
        color: '#757575',
        backgroundColor: "transparent"
    },
})
export default styles