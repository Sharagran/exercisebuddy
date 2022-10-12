import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function MyPagination({ dataSize, currentPage, changePage }) {
    const [page, setPage] = useState(currentPage);

    const pageCount = Math.ceil(dataSize / 10);

    useEffect(() => {
        var params = new URLSearchParams(window.location.search);
        setPage(Number(params.get('page')) || currentPage);
    }, [window.location.search])
    

    return (
        <Pagination style={{
            alignSelf: "center"
        }}>


            {pageCount > 5 ?
                <>
                    <Pagination.First disabled={page === 1} onClick={() => changePage(1)} />
                    <Pagination.Prev disabled={page === 1} onClick={() => changePage(page - 1)} />
                    <Pagination.Item onClick={() => changePage(1)}>{1}</Pagination.Item>

                    <Pagination.Ellipsis disabled />
                    <Pagination.Item onClick={() => changePage(page - 1)}>{page - 1}</Pagination.Item>
                    <Pagination.Item active>{page}</Pagination.Item>
                    <Pagination.Item onClick={() => changePage(page + 1)}>{page + 1}</Pagination.Item>
                    <Pagination.Ellipsis disabled />

                    <Pagination.Item onClick={() => changePage(pageCount)}>{pageCount}</Pagination.Item>
                    <Pagination.Next disabled={page === pageCount} onClick={() => changePage(page + 1)} />
                    <Pagination.Last disabled={page === pageCount} onClick={() => changePage(pageCount)} />
                </>
                : <>
                    {[...Array(pageCount)].map((_, i) => (
                        <Pagination.Item active={i === page - 1} key={i} onClick={() => changePage(i + 1)}>{i + 1}</Pagination.Item>
                    ))}
                </>}
        </Pagination>
    )
}
