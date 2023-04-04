import React, {useState, useEffect} from 'react';
import {Avatar, Card, Divider} from 'antd';
import moment from 'moment';
import {users} from './userData';
import LogData from './threeData';
import Chart from "./Chart";
import {Select} from 'antd';

const {Meta} = Card;

const CardList = () => {
    const [sorting, setSorting] = useState(null);
    const [userList, setUserList] = useState([]);
    const [prevUserList, setPrevUserList] = useState([]);


    useEffect(() => {
        let sortedCards = [];
        if(sorting === ''){
            setUserList([...prevUserList]);
        }
        if (sorting !== '') {
            sortedCards = [...userList].sort((a, b) => {
                switch (sorting) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'impressions':
                        return b.impressions - a.impressions;
                    case 'conversions':
                        return b.conversions - a.conversions;
                    case 'revenue':
                        return b.revenue - a.revenue;
                    default:
                        return 0;
                }
            });
            setUserList(sortedCards)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting]);


    useEffect(() => {
        getUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserData = () => {
        const sortedArray = users.map(user => {
            const {values, labels} = getChartData('conversion', user.id);
            return {
                name: user.name,
                avatar: user.name.charAt(0),
                impressions: getLogCount('impression', user.id),
                conversions: getLogCount('conversion', user.id),
                revenue: getRevenue(user.id).toFixed(2),
                labels: labels,
                values: values,
                allValue: {labels, datasets: [{ data: values, backgroundColor: 'rgba(53, 162, 235, 0.5)'}]}
            }
        });
        setUserList(sortedArray);
        setPrevUserList(sortedArray);
    };

    const getLogCount = (type, user_id) => {
        const filteredData = LogData.filter(item => item.user_id === user_id);

        return filteredData.filter(item => item.type === type).length;
    };


    const getChartData = (type, user_id) => {
        const filteredData = LogData.filter(item => item.user_id === user_id);
        const data = filteredData.filter(item => item.type === type);

        const dayCounts = data.reduce(function (result, entry) {
            var day = moment(entry.time).format("YYYY-MM-DD");

            if (!result[day]) {
                result[day] = 0;
            }
            result[day]++;
            return result;
        }, {});

        const SortDayCounts = Object.keys(dayCounts).sort().reduce(
            (obj, key) => {
                obj[key] = dayCounts[key];
                return obj;
            },
            {}
        );

        const labels = Object.keys(SortDayCounts);

        const values = labels.map((key) => SortDayCounts[key]);
        return {values, labels}

    };


    const getRevenue = (user_id) => {
        const filteredData = LogData.filter(item => item.user_id === user_id);
        return filteredData.map(item => item.revenue).reduce((prev, next) => prev + next);
    };


    return (
        <div>
            <div style={{display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center", padding: "30px"}}>
                <label htmlFor="sort" style={{ marginTop: '5px' }}>Sort by: </label>
                <Select
                    style={{
                        width: 120,
                    }}
                    onChange={(value) => setSorting(value)}
                    options={[
                        {
                            value: '',
                            label: '',
                        },
                        {
                            value: 'name',
                            label: 'Name',
                        },
                        {
                            value: 'impressions',
                            label: 'Impressions',
                        },
                        {
                            value: 'conversions',
                            label: 'Conversions'
                        },
                        {
                            value: 'revenue',
                            label: 'Revenue'
                        },
                    ]}
                />
            </div>
            <div className="user-card"
                 style={{display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center", padding: "30px"}}>
                {
                    userList.map((user, index) => {
                        return <Card
                            style={{width: 450, height: 500, backgroundColor: "lightcyan"}}
                            hoverable
                            key={index}
                        >
                            <Meta
                                avatar={<Avatar size={60} style={{backgroundColor: '#f56a00'}}
                                                alt={user.avatar}>{user.avatar}</Avatar>}
                                title={<div style={{fontSize: "25px"}}>{user.name}</div>}
                                description={user.occupation}
                            />
                            <Divider/>
                            <div>
                                <div style={{fontSize: "17px"}}>
                                    <p>Impressions: <span style={{fontWeight: "500"}}>{user.impressions}</span></p>
                                    <p>Conversions: <span style={{fontWeight: "500"}}>{user.conversions}</span></p>
                                    <p>Revenue: <span style={{fontWeight: "500"}}>{user.revenue}</span></p>
                                </div>
                                <div>
                                    <Chart data={user.allValue}/>
                                </div>
                            </div>
                        </Card>

                    })
                }
            </div>
        </div>
    );
};

export default CardList;