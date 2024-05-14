import { 
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Heading, Input, 
    Icon,
    HStack,
    Button,
    VStack,
    IconButton,
    useColorMode,
    useColorModeValue} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaBookQuran } from "react-icons/fa6";
import { IoMoonOutline, IoMoonSharp } from 'react-icons/io5';

const BookList = () => {
    // useState는 화면 랜더링에 반영됨
    const [bookList, setBookList] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('강아지똥');

    // useRef는 화면 랜더링에 반영되지 않는 참조값
    const pageCount = useRef(1);

    // Chakra UI에서 제공하는 훅
    const {colorMode, toggleColorMode} = useColorMode();
    const color = useColorModeValue('gray.400', "white")
    const buttonColor = useColorModeValue("blackAlpha", "whiteAlpha")

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
            <Heading color = {color}><Icon  as={FaBookQuran} boxSize={"1.5em"}/>도서 검색 목록</Heading>
            {
                colorMode === "light" ? 
                <IconButton icon={<IoMoonSharp/>} onClick={toggleColorMode} />: 
                <IconButton icon={<IoMoonOutline/>} onClick={toggleColorMode}/>
            }
            <Input type='text' placeholder='검색어입력' onChange={changeSearch} size="lg" variant="filled"></Input>
            {/* {bookList.map(book => (
                <>
                    <p>{book.title}</p>
                </>
            ))} */}
            <TableContainer>
                <Table variant={"striped"} colorScheme='blackAlpha'>
                    <Thead>
                        <Tr>
                            <Th>No</Th>
                            <Th>Title</Th>
                            <Th>Author</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bookList.map((book, index) => (
                        <>
                        <Tr>
                            <Td>{(page -1) * 10 + index + 1}</Td>
                            <Td>
                                <a href={book.url}>{book.title}</a>
                            </Td>
                            <Td>{book.authors}</Td>
                        </Tr>
                        </>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <HStack>
                {
                    Array.from({length: pageCount.current}, (_, index) => (
                        <>
                                <Button colorScheme={
                                    page === index + 1 ? "blue" : buttonColor
                                } onClick={e => {setPage(index + 1)}}>
                                {index + 1}
                                </Button>
                        </>
                    ))
                }
            </HStack>
        </>
    );
};

export default BookList;