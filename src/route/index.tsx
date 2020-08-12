import React from "react";
import { BrowserRouter, Route } from 'react-router-dom';

import ForecastSearch from '../components/ForecastSearch';

export default function Router() {
    return (
            <BrowserRouter>
                <Route exact path="/"  component={ForecastSearch} />
            </BrowserRouter>
    );
}