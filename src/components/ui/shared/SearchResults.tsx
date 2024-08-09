import { Models } from "appwrite";
import React from "react";
import Loader from "./Loader";
import GridPostList from "./GridPostList";
type SearchResultsProps ={
    isSearchFetching: boolean
    searchedPost: Models.Document[]
}
const SeachResults = ({isSearchFetching, searchedPost}: SearchResultsProps) => {
    if(isSearchFetching) return <Loader />

    if(searchedPost && searchedPost.documents.length > 0) return (
        <GridPostList post={searchedPost.documents}/>
    )
    return(
        <p className="text-light-4 mt-10 text-center w-full"> no results found </p>
    )
}

export default SeachResults