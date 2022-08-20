import React from 'react'
import Pagination from 'react-bootstrap/Pagination';

export default function MyPagination({ dataSize, page, setPage }) {

    const pageCount = Math.ceil(dataSize / 10);

    return (
        <Pagination style={{
            alignSelf: "center"
        }}>


            {pageCount > 5 ?
                <>
                    <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
                    <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
                    <Pagination.Item onClick={() => setPage(1)}>{1}</Pagination.Item>

                    <Pagination.Ellipsis disabled />
                    <Pagination.Item onClick={() => setPage(page - 1)}>{page - 1}</Pagination.Item>
                    <Pagination.Item active>{page}</Pagination.Item>
                    <Pagination.Item onClick={() => setPage(page + 1)}>{page + 1}</Pagination.Item>
                    <Pagination.Ellipsis disabled />

                    <Pagination.Item onClick={() => setPage(pageCount)}>{pageCount}</Pagination.Item>
                    <Pagination.Next disabled={page === pageCount} onClick={() => setPage(page + 1)} />
                    <Pagination.Last disabled={page === pageCount} onClick={() => setPage(pageCount)} />
                </>
                : <>
                    {[...Array(pageCount)].map((_, i) => (
                        <Pagination.Item active={i === page - 1} key={i} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>
                    ))}
                </>}
        </Pagination>
    )
}
