import React from 'react';

import DataTable from 'react-data-table-component';

export default (props) => {
    return (
        <>
            <DataTable 
                { ...props }
            />
        </>
    );
}