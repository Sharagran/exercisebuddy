import React from 'react'
import { useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function MyPagination({ dataSize, currentPage: page, setPage, PAGE_SIZE }) {

    const pageCount = Math.ceil(dataSize / PAGE_SIZE);

    useEffect(() => {
        var params = new URLSearchParams(window.location.search);
        setPage(Number(params.get('currentPage')) || page);
    }, [window.location.search])

    function renderPaginationItems() {
        if (pageCount > 5) {
            return renderReducedPageItems();
        } else {
            return renderEachPageItems();
        }
    }

    function renderReducedPageItems() {
        return (
            <>
                <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
                <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
                {page > 3 && <Pagination.Item onClick={() => setPage(1)}>{1}</Pagination.Item>}
                {page > 4 && <Pagination.Ellipsis disabled />}


                {page > 2 && <Pagination.Item onClick={() => setPage(page - 2)}>{page - 2}</Pagination.Item>}
                {page > 1 && <Pagination.Item onClick={() => setPage(page - 1)}>{page - 1}</Pagination.Item>}
                <Pagination.Item active>{page}</Pagination.Item>
                {page < pageCount && <Pagination.Item onClick={() => setPage(page + 1)}>{page + 1}</Pagination.Item>}
                {page < pageCount - 1 && <Pagination.Item onClick={() => setPage(page + 2)}>{page + 2}</Pagination.Item>}

                {page < pageCount - 3 && <Pagination.Ellipsis disabled />}
                {page < pageCount - 2 && <Pagination.Item onClick={() => setPage(pageCount)}>{pageCount}</Pagination.Item>}

                <Pagination.Next disabled={page === pageCount} onClick={() => setPage(page + 1)} />
                <Pagination.Last disabled={page === pageCount} onClick={() => setPage(pageCount)} />
            </>
        )
    }

    function renderEachPageItems() {
        return (
            <>
                {[...Array(pageCount)].map((_, i) => (
                    <Pagination.Item active={i === page - 1} key={i} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>
                ))}
            </>
        )
    }


    return (
        <>
            <Pagination style={{
                alignSelf: "center"
            }}>
                {renderPaginationItems()}
            </Pagination>
            {page * PAGE_SIZE - PAGE_SIZE + 1} - {page * PAGE_SIZE > dataSize ? dataSize : page * PAGE_SIZE} of {dataSize}
        </>
    )
}
