import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Container,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import alert from "../../utils/alert";
import { Pencil, Trash, Plus, Search, Sprout, Package, DollarSign, TrendingUp, Eye } from "lucide-react";

const Test = () => {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    const persons = [
        {
            name: "John",
            age: 15
        },
        {
            name: "Jane",
            age: 14
        },
        {
            name: "Jim",
            age: 22
        }
    ];
    
    Array.prototype.myMap = function myMap(callback) {
        const result = [];
        for(let i = 0; i < this.length; i++) {
            const element = this[i];
            result.push(callback(element));
        }
        
        return result;
    }

    const kids = persons.myMap(person => person.age < 18 ? person : null);
    console.log("kids: ", kids);

    function createTime() {
        let counter = 0;
        return function times() {
            counter++;
            console.log("counter: ", counter);
        }
    }
    const times1 = createTime();
    times1();
    times1();
  }, []);

 
  return (
    <Container fluid className="p-4">
      {/* Statistics Cards */}
      <div>dasda</div>
    </Container>
  );
};

export default Test;

