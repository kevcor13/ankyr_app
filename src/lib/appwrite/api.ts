import { ID, ImageGravity, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { Forklift } from "lucide-react";
import { OK } from "zod";

export async function createUserAccount(user: INewUser){
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        console.log('error here');
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })
        
        return newUser;
    } catch(error){
        console.log(error);
        return error;
    }
}


export async function saveUserToDB(user:{
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    console.log('error caused here')
    try{

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser;
    } catch(error){
        console.log(error);
    }
}

export async function signInAccount(user: {
    email: string; 
    password: string;
}){
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password)
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser(){
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        // upload image from storage '
        const uploadedFile = await uploadFile(post.file[0])
        console.log("file id is " + uploadedFile?.$id)
        
        if(!uploadedFile) throw Error;

        const fileUrl = await getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error;
        }

        //convert tags in an array

        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        //save post 
        console.log("im still here file id is " + uploadedFile.$id)
        console.log("this is fileUrl " + fileUrl)

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                imageUrl: fileUrl,
                imageid: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        )
        console.log("post id is " + newPost.$id)

        if(!newPost){
            await deleteFile(uploadedFile.$id)
            throw Error;
        }
        return newPost;
    } catch (error) {
        console.log(error)
    }
}

export async function uploadFile(file: File){
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
            )
        return uploadedFile
    } catch (error) {
        console.log(error)
    }
}

export async function getFilePreview(fileId: string): Promise<string | undefined>{
    try {
        const fileUrl = await storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100,
        )
        if (fileUrl instanceof URL) {
            return fileUrl.toString(); 
        } else {
            return JSON.stringify(fileUrl); 
        }
    } catch (error) {
        console.log(error) 
    }
}

export async function deleteFile(fileId: string){
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId)
        return{status:'ok'}
    } catch (error) {
        console.log(error)
    }
}