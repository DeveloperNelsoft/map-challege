import React from "react";
import { BrowserRouter, Route } from 'react-router-dom';

import DetailsCandidate from '../components/DetailsCandidate';

export default function Router() {
    return (
            <BrowserRouter>
                <Route exact path="/"  component={ListCandidate} />
                <Route exact path="/ListCandidate"  component={ListCandidate} />
                <Route exact path="/DetailsCandidate" component={DetailsCandidate} />
            </BrowserRouter>
    );