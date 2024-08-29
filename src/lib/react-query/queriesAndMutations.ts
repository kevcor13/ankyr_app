import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, fetchDocumentIdByField, fetchUserCompletion, fetchUserGoal, getCurrentUser, getInfinitePost, getPostById, getRecentPosts, getUserById, likePost, loseWeightChallange, savePost, searchPost, setUserGoalCompletion, signInAccount, signOutAccount, updatePost, updateUserInfo } from "@/lib/appwrite/api"
import { ILoseWeightInfo, INewChallenge, INewPost, INewUser, IUpdatePost, IUpdateUserInfo } from '@/types'
import { QUERY_KEYS } from './queryKeys';
import { create } from 'domain';
  

export const useCreateUserAccount = () =>{
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    });
};

export const useSignInAccount = () =>{
    return useMutation({
        mutationFn: (user: {
            email: string; 
            password: string;
        }) => signInAccount(user)
    })
}

export const useSignOutAccount = () =>{
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
         mutationFn : ({postId, likesArray} : { postId: string; likesArray:string[]}) => likePost(postId, likesArray),
         onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
         mutationFn : ({postId, userId} : { postId: string; userId:string }) => savePost(postId, userId),
         onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost  = () => {
    const queryClient = useQueryClient();

    return useMutation({
         mutationFn : (savedRecordId: string) => deleteSavedPost(savedRecordId),
         onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = (postId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string}) =>  deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetPost = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePost,
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null
            const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;

            return lastId
        }
    })
}

export const useSearchPost = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPost(searchTerm),
        enabled: !!searchTerm
    })
}
export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
};

export const useCreateWeeklyChallenges = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const promises = weekDays.map(day =>
                createChallenge({
                    title: `Challenge for ${day}`,
                    description: `Complete your task for ${day}`,
                    day,
                    userId,
                    completed: false,
                })
            );

            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CHALLENGES]});
        },
    });
};
export const useGetChallenges = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CHALLENGES, userId],
        queryFn: () => getChallenges(userId),
    });
};
export const useUpdateChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ challengeId, updates }: { challengeId: string; updates: { completed: boolean } }) =>
            updateChallenge(challengeId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CHALLENGES]});
        },
    });
};
export const useDeleteChallenge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (challengeId: string) => deleteChallenge(challengeId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CHALLENGES]});
        },
    });
};
export const useUpdateUserInfo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, updates }: { userId: string; updates: IUpdateUserInfo  }) => {
            return updateUserInfo(userId, updates );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:[QUERY_KEYS.GET_UPDATE_USER_GOALS]});
        },
        onError: (error) => {
            console.error('Error updating user information:', error);
            alert('Failed to update user information.');
        },
    });
};
export const useFetchUserCompletionMutation = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMPLETE],
        queryFn: () => fetchUserCompletion(userId),
    })
};
export const useUserGoal = (userId: string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.USER_GOAL, userId], 
        queryFn:() => fetchUserGoal(userId), 
        enabled: !!userId, 
        retry: false, 
    });
};
