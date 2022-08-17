import React from 'react';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default (props) => {
    const options = (props.options && props.options.length > 0) ? props.options : [];
    const placeholder = (props.placeholder) ? props.placeholder : 'Search here...';
    
    return (
        <>
            <AsyncTypeahead 
                isLoading={ props.isLoading || false }
                clearButton
                minLength={ 1 }
                paginate={ false }
                useCache={ false }
                id={ props.id }
                labelKey={ props.labelKey }
                options={ options }
                //selected={ selected }
                placeholder={ placeholder }
                inputProps={{
                    id: 'input_' + props.id
                }}
                filterBy={() => true}
                onSearch={search => {
                    props.onSearch(search);
                }}
                // onInputChange={(search, e) => {
                //     props.onSearch(search);
                // }}
                // onFocus={(e) => {
                //     if(e.target && e.target.value)
                //     {
                //         props.onSearch(e.target.value);
                //     }
                // }}
                onChange={selected => {
                    if(selected.length > 0)
                    {
                        props.onChange(selected);
                    }
                }}
                // renderMenuItemChildren={(option) => (
                //   <div key={ option.id }>
                //     <span>{ option.name }</span>
                //   </div>
                // )}
            />
        </>
    );
}