mport React, { useState, useEffect} from 'react';
import { Accordion, Card, Button, Form, FormControl } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import {FilterListCandidate} from './FilterListCandidate'
import getAxios from '../apiRestConnector';


interface ListCandidateProps {
    candidates?: Candidate[];
}

interface Candidate {
    name: string,
    score: number
}

const FilterCandidate: React.SFC<ListCandidateProps> = props => {

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [isCandidateNotfound, setCandidateNotfound] = useState(false);

  const handleChange = (event:any) => {
     setSearchTerm(event.target.value);
   };

   const getTranslateSkills = (varskills: any) => {
        let itemCandidate: Candidate[] = [];

        console.log(searchResults);
        if(varskills.skills !== undefined){
            varskills.skills.map((itemSkills:any) =>
                itemSkills.skills.map((item:any) => {
                    itemCandidate.push({name: item.nombre, score: item.nota})
                }));

        }

        return  itemCandidate;
    }

    const onBtnSearchClick = (event: any) => {

    const urlBackend = `http://localhost:3050/personas/${searchTerm}`;

    getAxios.instance('').get(urlBackend).then((result: any) => result.data)
    .then((itemPerson: any) => {
        console.log('api itemPerson result: ', itemPerson);
        setSearchResults(itemPerson);
        setCandidateNotfound(false);
    }).catch((error:any) => {
        console.log('error: ', error);
        setCandidateNotfound(true);
        setSearchResults(error.message);
    });
  };

    return(
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                        <Form inline className="mx-auto col-12">
                            <FormControl type="text" placeholder="Postulante" className="col-9 col-md-6"
                            value={searchTerm} onChange={handleChange} />
                            <Button className="col-3 col-md-3" variant="outline-primary" onClick={(event: any) => {onBtnSearchClick(event)}} ><Search /></Button>

                            <Accordion.Toggle className="col-12 col-md-3" as={Button} variant="link" eventKey="1">
                                Avanzadas
                        </Accordion.Toggle>
                        </Form>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>Propiedades Avanzadas</Card.Body>
                    </Accordion.Collapse>
                    <h1> {isCandidateNotfound && <p>Candidate not found...</p>}</h1>
                    <FilterListCandidate candidates={getTranslateSkills(searchResults)}/>
                </Card>
            </Accordion>
   );
};

export default FilterCandidate;
