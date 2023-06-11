import React from 'react';

const Pagination = props => {
    const { currentPage, length, itemsPerpage,setCurrentPage} = props;
    const pageCount = Math.ceil(length / itemsPerpage);
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }
    const handleDirectionPage = (type) => {
        if (type === "next") {
            setCurrentPage((prev)=>{
                if (prev<pageCount){
                    return prev + 1
                }else {
                    return 1
                }
            })
        }else if (type ==="prev"){
            setCurrentPage((prev)=>{
                if (prev > 1){
                    return prev -1
                }else {
                    return pageCount
                }
            })

        }else {
            setCurrentPage(type);
        }

    }
    return (
        <ul className="pagination pagination-sm">
            <li className="page-item">
                <button className="page-link" onClick={() => handleDirectionPage("prev")}>&laquo;</button>
            </li>
            {
                pages.map((page) => {
                    return <li
                        className={currentPage === page ? "page-item active" : "page-item"}
                        key={page}
                        onClick={() => handleDirectionPage(page)}
                    >
                        <button className="page-link">{page}</button>
                    </li>
                })
            }


            <li className="page-item">
                <button className="page-link" onClick={() => handleDirectionPage("next")}>&raquo;</button>
            </li>
        </ul>
    );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
}
export default Pagination;
