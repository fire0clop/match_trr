import React, { useState } from 'react';
import useSWR from 'swr';
import './MatchTracker.css';
import refreshIcon from './Refresh.png'; // Импорт иконки загрузки
import comand_logo from './illustrations_role.png'

const fetcher = (url) => fetch(url).then((res) => res.json());

const MatchTracker = () => {
    const { data, error, isLoading, mutate } = useSWR(
        'https://app.ftoyd.com/fronttemp-service/fronttemp',
        fetcher
    );

    const [page, setPage] = useState(1);
    const matchesPerPage = 5;

    if (error) {
        return (
            <div className="match-tracker-container">
                <div className="error-container">
                    <span>⚠ Ошибка: не удалось загрузить информацию</span>
                    <button className="refresh-btn" onClick={() => mutate()}>
                        <span>Обновить</span>
                        <img src={refreshIcon} alt="Refresh Icon" />
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="match-tracker-container"><div className="loading">Загрузка...</div></div>;
    }

    const matches = data?.data?.matches || [];
    const totalPages = Math.ceil(matches.length / matchesPerPage);
    const startIndex = (page - 1) * matchesPerPage;
    const selectedMatches = matches.slice(startIndex, startIndex + matchesPerPage);

    return (
        <div className="match-tracker-container">
            <div className="match-tracker">
                <div className="header">
                    <h1>Match Tracker</h1>
                    <button className="refresh-btn" onClick={() => mutate()}>
                        <span>Обновить</span>
                        <img src={refreshIcon} alt="Refresh Icon" />
                    </button>
                </div>

                <div className="match-list">
                    {selectedMatches.map((match, index) => {
                        let statusClass = 'status';
                        if (match.status === 'Ongoing') statusClass += ' live';
                        else if (match.status === 'Finished') statusClass += ' finished';
                        else if (match.status === 'Scheduled') statusClass += ' scheduled';

                        return (
                            <div key={index} className="match-card">
                                {/* Левая команда */}
                                <div className="team team-left">
                                    <img src={comand_logo} alt="Team Logo" className="team-icon" />
                                    <span>{match.homeTeam.name}</span>
                                </div>

                                {/* Счёт и статус */}
                                <div className="score-section">
                                    <div className="score">{match.homeScore} : {match.awayScore}</div>
                                    <div className={statusClass}>
                                        {match.status === 'Ongoing' ? 'Live' : match.status}
                                    </div>
                                </div>

                                {/* Правая команда */}
                                <div className="team team-right">
                                    <span>{match.awayTeam.name}</span>
                                    <img src={comand_logo} alt="Team Logo" className="team-icon" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Пагинация */}
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Назад</button>
                    <span>Страница {page} из {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Вперёд →</button>
                </div>
            </div>
        </div>
    );
};

export default MatchTracker;
