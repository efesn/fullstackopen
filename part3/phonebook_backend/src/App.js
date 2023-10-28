import { useState, useEffect } from 'react'
import axios from 'axios'
import persons from './db.json'

const App = () => {

  const [persons, setPersons] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [showMessage, setShowMessage] = useState(false);


  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data);
        const numbers = response.data.map(person => person.number);
        setNumbers(numbers);
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    }
  
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        axios
          .put(`http://localhost:3001/persons/${existingPerson.id}`, newPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response.data
              )
            );
            setNumbers(
              numbers.map((number, i) =>
                i !== persons.indexOf(existingPerson) ? number : newNumber
              )
            );
            setNewName("");
            setNewNumber("");
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false);
            }, 3000);
          });
      } else {
        return;
      }
    } else {
      axios.post("http://localhost:3001/persons", newPerson).then((response) => {
        setPersons(persons.concat(response.data));
        setNumbers(numbers.concat(newNumber));
        setNewName("");
        setNewNumber("");
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      });
    }
  };
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const addNumber = (event) => {
    event.preventDefault();
    const numberExists = numbers.find(number => number === newNumber);
    if (numberExists) {
      alert(`${newNumber} is already added to phonebook`);
      return;
    }
    setNumbers([...numbers, newNumber]);
    setNewNumber('');
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };
  

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleDeletePerson = (id) => {
  if (window.confirm("Do you really want to delete this person?")) {
    axios.delete(`http://localhost:3001/persons/${id}`).then((response) => {
      setPersons(persons.filter((person) => person.id !== id));
      setNumbers(numbers.filter((number, i) => i !== id));
    });
  }
};
  return (
    <div>
      <h2>Phonebook</h2>
      {showMessage && <div className="notification">Person added successfully!</div>}
      <div>
        filter shown with:
        <input value={filterName} onChange={handleFilterChange} />
      </div>

      <form onSubmit={addPerson}>

        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <button type="submit">add</button>

      </form>

      <h2>Numbers</h2>
      {filteredPersons.map((person, i) => (
        <div key={i}>
          {person.name} {numbers[i]}
          <button onClick={() => handleDeletePerson(person.id)}>delete</button>
        </div>
      ))}

    </div>
  );
};

export default App;
