// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    databaseURL: 'https://mindx-game.firebaseio.com',
    apiKey: 'AIzaSyD6P2iftV6fCECTzyI_2jmTUVudTAcgDmE',
    authDomain: 'mindx-game.firebaseapp.com',
    projectId: 'mindx-game',
    storageBucket: 'mindx-game.appspot.com',
    messagingSenderId: '908993330967',
    appId: '1:908993330967:web:eab7d0e463430defdfc152',
    measurementId: 'G-ZYJTGWZ5CE',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let FB = firebase.firestore();

export default FB;
