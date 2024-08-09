import { Input } from "@/components/ui/input";
import GridPostList from "@/components/ui/shared/GridPostList";
import SeachResults from "@/components/ui/shared/SearchResults";
import useDebounce from "@/hooks/useDebounce";
import { useGetPost, useSearchPost } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";


const Explore =() => {
    const { ref, inView} = useInView()
    const {data: post, fetchNextPage, hasNextPage} = useGetPost();
    const [searchValue, setSearchValue] = useState('')
    const debounceValue = useDebounce(searchValue, 500)
    const {data: searchPost, isFetching: isSearchFetching } = useSearchPost(debounceValue)
    
    useEffect(() => {
        if(inView && !searchValue) fetchNextPage();
    }, [inView, searchValue])

    if(!post) {
        return (
            <div className="flex-center w-full h-ful">
                <Loader />
            </div>
        )
    }
    const shouldShowSearchResults = searchValue !== '';
    const shouldShowPost = !shouldShowSearchResults && post.pages.every((item) => item.documents.length === 0)
    return (
        <div className="explore-container">
            <div className="explore-inner_conatiner">
                <h2 className="h3-bold md:h2-bold w-full">search post</h2>
                <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
                    <img src="/assets/icons/search.svg" width={24} height={24} alt="search"/>
                    <Input type="text" placeholder="search" className="explore-search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                </div>
            </div>
            <div className="flex-between w-full max-w-5xl mt-16 mb-7">
                <h3 className="body-bold md:h3-bold">popular today</h3>
                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base_medium">All</p>
                    <img src="/assets/icons/filter.svg" width={20} height={20} alt="filter" />
                </div>
            </div>

            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {shouldShowSearchResults? (
                    <SeachResults isSearchFetching={isSearchFetching} searchPost={searchPost} />
                ) : shouldShowPost ? (
                    <p className="text-light-4 mt-10 text-center w-full">End of Post </p>
                ): post.pages.map((item, index) => (
                    <GridPostList key={`page-${index}`} post={item.documents} />
                ))}
            </div>
            {hasNextPage && !searchValue && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Explore;
