import React from "react";
import ChartistGraph from "react-chartist";
import Board, { moveCard } from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";
// Use your own styles to override the default styles
import "../assets/css/kanban.css";
// react-bootstrap components
import {
    Badge,
    Button,
    Card,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
    Form,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";

const board = {
    columns: [
        {
            id: 0,
            title: "Open",
            backgroundColor: "#fff",
            cards: [
                {
                    id: 1,
                    title: "DF-22110005",
                    description: (
                        <div>
                            <label className="description-text">Unit No :10/100</label> <br />
                            <label className="description-text">
                                ชื่อลูกค้า : นายไอคอน เฟรมเวิร์ค
                            </label>
                            <br />
                            <label className="description-text">
                                วันที่แจ้งเคส : 11/11/2022
                            </label>
                            <br />
                            <label className="description-text">
                                ผู้ดูแลเคส : นายเฟรมเวิร์ค ไอคอน
                            </label>
                            <br />
                            <label className="description-text" style={{ color: "red" }}>
                                SLA : 5 Days (OverDue)
                            </label>
                            <br />
                        </div>
                    )
                },
                {
                    id: 2,
                    title: "DF-22110009",
                    description: (
                        <div>
                            <label className="description-text">Unit No :10/100</label> <br />
                            <label className="description-text">
                                ชื่อลูกค้า : นายไอคอน เฟรมเวิร์ค
                            </label>
                            <br />
                            <label className="description-text">
                                วันที่แจ้งเคส : 16/12/2022
                            </label>
                            <br />
                            <label className="description-text">
                                ผู้ดูแลเคส : นายเฟรมเวิร์ค ไอคอน
                            </label>
                            <br />
                            <label className="description-text" style={{ color: "red" }}>
                                SLA : 7 Days (OverDue)
                            </label>
                            <br />
                        </div>
                    )
                }
            ]
        },
        {
            id: 1,
            title: "InProgress",
            cards: [
                {
                    id: 9,
                    title: "Card title 9",
                    description: "Card content"
                }
            ]
        },
        {
            id: 2,
            title: "Cancel",
            cards: [
                {
                    id: 10,
                    title: "Card title 10",
                    description: "Card content"
                },
                {
                    id: 11,
                    title: "Card title 11",
                    description: "Card content"
                }
            ]
        },
        {
            id: 3,
            title: "In Complete",
            cards: [
                {
                    id: 12,
                    title: "Card title 12",
                    description: "Card content"
                },
                {
                    id: 13,
                    title: "Card title 13",
                    description: "Card content"
                }
            ]
        }
    ]
};

function ControlledBoard() {
    // You need to control the state yourself.
    const [controlledBoard, setBoard] = useState(board);

    function handleCardMove(_card, source, destination) {
        const updatedBoard = moveCard(controlledBoard, source, destination);
        console.log(":");

        setBoard(updatedBoard);
    }

    return (
        <Board onCardDragEnd={handleCardMove} disableColumnDrag>
            {controlledBoard}
        </Board>
    );
}
function onCardMove(card, source, destination) {
    // const updatedBoard = moveCard(board, source, destination);
    // setBoard(updatedBoard);

    console.log("----------");
    console.log("card : ", card);
    console.log("source : ", source);
    console.log("destination : ", destination);
}
function onCardMoveStart(card, source, destination) {
    // const updatedBoard = moveCard(board, source, destination);
    // setBoard(updatedBoard);

    console.log("----------");
    console.log("start card : ", card);
    console.log("start source : ", source);
    console.log("start destination : ", destination);
}

function UncontrolledBoard() {
    return (
        <Board
            allowRemoveLane
            allowRenameColumn
            allowRemoveCard
            onLaneRemove={console.log}
            onCardRemove={console.log}
            onCardDragEnd={onCardMove}
            onCardDragStart={onCardMoveStart}
            onLaneRename={console.log}
            initialBoard={board}
            allowAddCard={{ on: "top" }}
            onNewCardConfirm={(draftCard) => ({
                id: new Date().getTime(),
                ...draftCard
            })}
            onCardNew={console.log}
        />
    );
}

function Kanban() {
    return (
        <>
            <Container fluid>
                <UncontrolledBoard />
            </Container>
        </>
    );
}

export default Kanban;
