import { ID, ImageGravity, Models, Query } from "appwrite";
import { ILoseWeightInfo, INewChallenge, INewPost, INewUser, IUpdatePost, IUpdateUserInfo } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

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
                caption: post.caption,
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

export async function getFilePreview(fileId: string){
    try {
        const fileUrl = await storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100,
        )
        return fileUrl;
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

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if(!posts) throw Error;

    return posts;
}

export async function likePost( postId: string,likesArray: string[] ) {
    try {
        const updatePost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if(!updatePost) throw Error;

        return updatePost;
    } catch (error) {
        console.log(error)
    }
}

export async function savePost( postId: string, userId: string ) {
    try {
        const updatePost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if(!updatePost) throw Error;

        return updatePost;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteSavedPost( savedRecordId: string ) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        )
        if(!statusCode) throw Error;

        return {status: 'ok'};
    } catch (error) {
        console.log(error)
    }
}

export async function getPostById(postId: string){
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return post;
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
    const hadFileToUpdate = post.file.length > 0;
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        }

        if(hadFileToUpdate){

            const uploadedFile = await uploadFile(post.file[0])
            if(!uploadedFile) throw Error;
                 
        const fileUrl = await getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error;
        }
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }
    
            //convert tags in an array

        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageid: image.imageId,
                location: post.location,
                tags: tags,
            }
        )

        if(!updatedPost){
            await deleteFile(post.imageId)
            throw Error;
        }
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function deletePost(postId: string, imageId: string){
    if(!postId || !imageId) throw Error; 
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return { status: 'ok'}
    } catch (error) {
        console.log(error)
    }
}

export async function getInfinitePost({pageParam}: {pageParam: number}) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!post) throw Error

        return post
    } catch (error) {
        console.log(error)
    }
}

export async function searchPost(searchTerm: string) {

    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if(!post) throw Error

        return post
    } catch (error) {
        console.log(error)
    }
}

export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }

export const createChallenge = async (challenge: INewChallenge) => {
    return databases.createDocument(
        appwriteConfig.databaseId, appwriteConfig.userProgressId, ID.unique(), challenge);
};
export const getChallenges = async (userId: string) => {
    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userProgressId, [
        Query.equal('userId', userId),
    ]);
    return response.documents;
};
export const updateChallenge = async (challengeId: string, updates: { completed: boolean }) => {
    return databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.userProgressId, challengeId, updates);
};
export const deleteChallenge = async (challengeId: string) => {
    return databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.userProgressId, challengeId);
};

export const updateUserInfo = async (userId: string, updates: IUpdateUserInfo) => {
    try {
        const response = await databases.updateDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId, 
            userId, 
            {
                gender: updates.gender,
                age: updates.age,
                weight: updates.weight,
                fitness: updates.fitness,
                workoutdays: updates.workoutdays,
                goal: updates.goal,
                complete: true,
            }
        );
        return response;
    } catch (error) {
        console.error("Failed to update user information:", error);
        throw error;
    }
};


export const fetchUserGoal = async (userId: string) => {
    try {
        const response = await databases.getDocument(appwriteConfig.databaseId,appwriteConfig.userCollectionId, userId);
        console.log(response.goal)
        return response.goal;

    } catch (error) {
        console.error('Error fetching user goal:', error);
        throw error;
    }
};

export const setUserGoalCompletion = async (userId: string) => {
    try {
        const response = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, userId, {
            secondComplete: true,
        });
        console.log("completion has been changed")
        return response;
    } catch (error) {
        console.error('Error setting user goal completion:', error);
        throw error;
    }
};

export const updateUserDocument = async (userId: string, collection: string, chosenWorkout: string, days: number) => {
    try {
        const response = await databases.updateDocument(appwriteConfig.databaseId, collection, userId,
        {
            chosenWorkout,
            days
        })
        console.log("info has been updated")
        return response
    } catch (error) {
        console.log(error)
    }
}

export const fetchUserCompletion = async (userId: string) => {
    try {
        const complete = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, userId);
        console.log(complete.complete);
        return complete.complete;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch user completion');
    }
};

export const fetchUserSecondCompletion = async (userId: string) => {
    try {
        const complete = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, userId);
        console.log(complete.complete);
        return complete.secondComplete;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch user completion');
    }
};


export const loseWeightChallange = async (values: ILoseWeightInfo) => {
    try {
        const document = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.loseWeightId,
            ID.unique(),
            values
        )
        return document
    } catch (error) {
        console.log(error)
    }
}

export const gainMuscleChallange = async (days: number, completion: boolean) => {
    try {
        const document = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.gainMuscleId,
            ID.unique(),
            {
                days,
                completion
            }
        )
        return document
    } catch (error) {
        console.log(error)
    }
}

export const creatingChallangeDocument = async (userId: string, userGoal: string) => {
    try {
        console.log(userGoal);
        if(userGoal === "lose weight"){
                const challange = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.loseWeightId,
                ID.unique(),
                {
                    user: userId,
                    complete: false
                }
            )
            return challange;
        } else if(userGoal === "gain muscle"){
                const challange = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.gainMuscleId,
                ID.unique(),
                {
                    user: userId,
                    completion: false
                }
            )
            return challange;
        }
        

    } catch (error) {
        console.log(error)
    }
}

export const fetchDocumentIdByField = async (collectionId: string, field: string, value: string) => {
    try {
        const response = await databases.listDocuments(appwriteConfig.databaseId, collectionId, [
            Query.equal(field, value),
        ]);
        if (response.total > 0) {
            return response.documents[0].$id;
        } else {
            throw new Error('No document found');
        }
    } catch (error) {
        throw new Error('Failed to fetch document ID');
    }
};
