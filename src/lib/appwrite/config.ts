import { Client, Account, Databases, Storage, Avatars} from 'appwrite'

export const appwriteConfig = {
    projectId: "669dceeb0027017a4cbd",
    url: "https://cloud.appwrite.io/v1",
    databaseId: "66a1d1ad0033607f02c9",
    storageId: "66a1d17600171be58027",
    userCollectionId: "66a1d2160029663f2c0d",
    postCollectionId: "66a1d1ef00055ee4390e",
    savesCollectionId: "66a1d227001b89c370ae",
    userProgressId: '66ba84ec00127fe872da',
    moreUserInfoId: '66c105ac001fd97dd857',
    loseWeightId: '66c2bdd300256cfad0f1',
    gainMuscleId: '66c75ede00168f8fc93a'
}


export const client = new Client();

client.setProject('669dceeb0027017a4cbd');
client.setEndpoint('https://cloud.appwrite.io/v1');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);