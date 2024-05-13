import { Heading, Input } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

const BookList = () => {
    // useState는 화면 랜더링에 반영됨
    const [bookList, setBookList] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('강아지똥');

    // useRef는 화면 랜더링에 반영되지 않는 참조값
    const pageCount = useRef(1);

    const fetchBooks = async() => {
        const response = await fetch(`https://dapi.kakao.com/v3/search/book?query=${search}&page=${page}`,
            {
                method: "GET",
                headers: {
                    Authorization : `KakaoAK ${process.env.REACT_APP_API_KEY}`,

                },
            }
        );
        const data = await response.json();
        console.log(data);

        pageCount.current = data.meta.pageable_count % 10 > 0 ? data.meta.pageable_count / 10 + 1 : data.meta.pageable_count / 10;
        pageCount.current = Math.floor(pageCount.current);
        pageCount.current =pageCount.current > 15 ? 15 : pageCount.current;

        console.log(pageCount.current);
        setBookList(data.documents);
    }

    const changeSearch = e => {
        //내용 작성
        if(e.target.value.length >= 2){
            setSearch(e.target.value);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, [page, search]);


    return (
        <>
            <Heading>도서 검색 목록</Heading>
            <Input type='text' placeholder='검색어입력' onChange={changeSearch} size="lg" variant="filled"></Input>
            <div>
                {bookList.map(book => (
                    <>
                        <p>{book.title}</p>
                    </>
                ))}
            </div>
            <ul>
                {
                    Array.from({length: pageCount.current}, (_, index) => (
                        <>
                            <li onClick={e => {setPage(index + 1)}}>{index + 1}</li>
                        </>
                    ))
                }
            </ul>
        </>
    );
};

export default BookList;