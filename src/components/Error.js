import React from 'react';

export const NotFound = (props) => {
    return (
        <>
            <div className="container">
                <div className="mt-3">
                    <h1>404 - Not Found</h1>
                </div>
                <div className="mt-3">
                    The page you were looking for could not be found.
                </div>
            </div>
        </>
    );
}

export const Unauthorized = (props) => {
    return (
        <>
            <div className="container">
                <div className="mt-3">
                    <h1>401 - Unauthorized</h1>
                </div>
                <div className="mt-3">
                    You aren’t authenticated to access this page.
                </div>
            </div>
        </>
    );
}

export const Forbidden = (props) => {
    return (
        <>
            <div className="container">
                <div className="mt-3">
                    <h1>403 - Forbidden</h1>
                </div>
                <div className="mt-3">
                    You don’t have permission to access this page.
                </div>
            </div>
        </>
    );
}