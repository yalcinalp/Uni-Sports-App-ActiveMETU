import {Client, Account, ID} from 'react-native-appwrite';

export const ID_DB1 = `6727eddd0032e321ca4e`;
export const ID_Collection_Events = `6729eaaf00144aa270bb`;

export const appwrite = new Client()
    .setProject('6727e13100340c93006c')
    .setPlatform('com.HHF.ActiveMETU');
