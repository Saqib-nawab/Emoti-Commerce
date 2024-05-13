import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import ReviewCharts from './ReviewCharts';

const CallHistoryComponent = () => {
    const [callHistory, setCallHistory] = useState([]);

    useEffect(() => {
        const fetchCallHistory = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/callHistories');
                setCallHistory(response.data);
            } catch (error) {
                console.error('Error fetching call history:', error);
            }
        };

        fetchCallHistory();
    }, []);

    const Row = ({ row }) => {
        const [open, setOpen] = useState(false);
        const [conversationData, setConversationData] = useState({ userPromptsArr: [], chatbotResponsesArr: [] });

        const handleConversation = () => {
            setConversationData({
                userPromptsArr: row.userPromptsArr,
                chatbotResponsesArr: row.chatbotResponsesArr
            });
            setOpen(!open);
        };

        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell onClick={handleConversation}>conversation</TableCell>
                    <TableCell>{row.sentiment}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Detail Sentiment
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Label</TableCell>
                                            <TableCell>Score</TableCell>
                                            <TableCell>Diagrams</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Iterate over detail_sentiment and map only the first two cells */}
                                        {row.detail_sentiment.map((subArray, index) => (
                                            <TableRow key={index}>
                                                {/* Map only the first cell for labels */}
                                                <TableCell>
                                                    <ul>
                                                        {subArray.map((item, subIndex) => (
                                                            <li key={subIndex}>{item.label}</li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                {/* Map only the second cell for scores */}
                                                <TableCell>
                                                    <ul>
                                                        {subArray.map((item, subIndex) => (
                                                            <li key={subIndex}>{item.score}</li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                {/* Render ReviewCharts without mapping for the third cell */}
                                                <TableCell>
                                                    <ReviewCharts
                                                        labels={row.detail_sentiment[0].map(item => item.label)}
                                                        scores={row.detail_sentiment[0].map(item => item.score)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                {open && (
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Conversation Data
                                    </Typography>
                                    <Table size="small" aria-label="conversation-data">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>User Prompts</TableCell>
                                                <TableCell>Chatbot Responses</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(row.userPromptsArr) && Array.isArray(row.chatbotResponsesArr) &&
                                                row.userPromptsArr.map((userPrompt, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{userPrompt}</TableCell>
                                                        <TableCell>{row.chatbotResponsesArr[index]}</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                )}
            </React.Fragment>
        );
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Username</TableCell>
                        <TableCell>Conversation</TableCell>
                        <TableCell>Sentiment</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {callHistory.map((row) => (
                        <Row key={row._id} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CallHistoryComponent;
