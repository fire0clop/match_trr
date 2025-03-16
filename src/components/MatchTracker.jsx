import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import './MatchTracker.css';
import refreshIcon from './media/Refresh.png';
import comand_logo from './media/illustrations_role.png';
import player_icon from './media/user-frames.png';
import errorIcon from './media/Vector.png';
import company_logo from './media/Match Tracker.png';
import expandedIcon from './media/chevron-up.png';
const fetcher = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        return await res.json();
    } catch (error) {
        throw new Error(error.message || 'Ошибка загрузки данных');
    }
};

const MatchTracker = () => {
    const { data, error, isLoading, mutate } = useSWR(
        'https://app.ftoyd.com/fronttemp-service/fronttemp',
        fetcher
    );

    const [page, setPage] = useState(1);
    const matchesPerPage = 5;
    const [expandedMatch, setExpandedMatch] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Все статусы");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (error) {
            setErrorMessage(error.message || "Ошибка: не удалось загрузить информацию");
        } else {
            setErrorMessage("");
        }
    }, [error]);

    const handleRefresh = () => {
        setErrorMessage("");
        mutate();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setIsDropdownOpen(false);
    };

    if (isLoading) {
        return <div className="match-tracker-container"><div className="loading">Загрузка...</div></div>;
    }

    let matches = data?.data?.matches || [];

    if (selectedStatus !== "Все статусы") {
        matches = matches.filter(match => {
            if (selectedStatus === "Live" && match.status === "Ongoing") return true;
            if (selectedStatus === "Finished" && match.status === "Finished") return true;
            if (selectedStatus === "Match preparing" && match.status === "Scheduled") return true;
            return false;
        });
    }

    const totalPages = Math.ceil(matches.length / matchesPerPage);
    const startIndex = (page - 1) * matchesPerPage;
    const selectedMatches = matches.slice(startIndex, startIndex + matchesPerPage);

    return (
        <div className="match-tracker-container">
            <div className="match-tracker">
                <div className="header">
                    <img src={company_logo} alt="" className="company_logo"/>

                    {/* Фильтр статусов */}
                    <div className="status-filter">
                        <button className="dropdown-button" onClick={toggleDropdown}>
                            {selectedStatus} <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => handleStatusChange("Все статусы")}>Все статусы</div>
                                <div className="dropdown-item" onClick={() => handleStatusChange("Live")}>Live</div>
                                <div className="dropdown-item" onClick={() => handleStatusChange("Finished")}>Finished</div>
                                <div className="dropdown-item" onClick={() => handleStatusChange("Match preparing")}>Match preparing</div>
                            </div>
                        )}
                    </div>

                    <div className="refresh-container">
                        {errorMessage && (
                        <span className="error-message">
                            <img src={errorIcon} alt="Error Icon" className="error-icon" />
                                {errorMessage} Ошибка: данные не загружены
                        </span>
                        )}
                        <button className="refresh-btn" onClick={handleRefresh}>
                            <span>Обновить</span>
                            <img src={refreshIcon} alt="Refresh Icon" />
                        </button>
                    </div>
                </div>

                <div className="match-list">
                    {selectedMatches.map((match, index) => {
                        let statusClass = 'status';
                        if (match.status === 'Ongoing') statusClass += ' live';
                        else if (match.status === 'Finished') statusClass += ' finished';
                        else if (match.status === 'Scheduled') statusClass += ' scheduled';

                        return (
                            <div key={index} className="match-container">
                                <div
                                    className={`match-card ${expandedMatch === index ? 'expanded' : ''}`}
                                    onClick={() => setExpandedMatch(expandedMatch === index ? null : index)}
                                >
                                    <div className="team team-left">
                                        <img src={comand_logo} alt="Team Logo" className="team-icon" />
                                        <span>{match.homeTeam.name}</span>
                                    </div>

                                    <div className="score-section">
                                        <div className="score">{match.homeScore} : {match.awayScore}</div>
                                        <div className={statusClass}>
                                            {match.status === 'Ongoing'
                                                ? 'Live'
                                                : match.status === 'Scheduled'
                                                    ? 'Match preparing'
                                                    : match.status}
                                        </div>
                                    </div>

                                    <div className="team team-right">
                                        <span className="team-name">{match.awayTeam.name}</span>
                                        <img src={comand_logo} alt="Team Logo" className="team-icon" />
                                        <span className={`expand-icon ${expandedMatch === index ? 'expanded' : ''}`}>
                                            <img src={expandedIcon} alt="Expand Icon" className="expand-icon-img" />
                                        </span>
                                    </div>


                                </div>

                                {/* Дополнительное меню */}
                                {expandedMatch === index && (
                                    <div className="match-details">
                                        <div className="team-details">
                                            {/* Домашняя команда */}
                                            <div className="team-column">
                                                {/* Блок с игроками */}
                                                <div className="players-row">
                                                    {match.homeTeam.players.slice(0, 3).map((player) => (
                                                        <div key={player.username} className="player-card">
                                                            <img src={player_icon} alt="Player Icon" className="player-icon" />
                                                            <span className="player-username">{player.username}</span>
                                                            <span className="player-kills">Убийств: </span> <span className="player-kills-count">{player.kills}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Блок с очками, местом и убийствами */}
                                                <div className="stats-row">
                                                    <div className="stats_marg"><span className="transparent_text">Points: </span><span className="player-kills-count">{match.homeTeam.points}</span></div>
                                                    <div className="stats_marg"><span className="transparent_text">Место: </span><span className="player-kills-count">{match.homeTeam.place}</span></div>
                                                    <div className="stats_marg"><span className="transparent_text">Всего убийств: </span><span className="player-kills-count">{match.homeTeam.total_kills}</span></div>
                                                </div>
                                            </div>





                                            <div className="team-column">
                                                {/* Блок с игроками */}
                                                <div className="players-row">
                                                    {match.awayTeam.players.slice(0, 3).map((player) => ( // Ограничиваем до 3 игроков
                                                        <div key={player.username} className="player-card">
                                                            <img src={player_icon} alt="Player Icon" className="player-icon" />
                                                            <span className="player-username">{player.username}</span>
                                                            <span className="player-kills">Убийств:</span> <span className="player-kills-count">{player.kills}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Блок с очками, местом и убийствами */}
                                                <div className="stats-row">
                                                    <div className="stats_marg"><span className="transparent_text">Points: </span><span className="player-kills-count">{match.awayTeam.points}</span></div>
                                                    <div className="stats_marg"><span className="transparent_text">Место: </span><span className="player-kills-count">{match.awayTeam.place}</span></div>
                                                    <div className="stats_marg"><span className="transparent_text">Всего убийств: </span><span className="player-kills-count">{match.awayTeam.total_kills}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

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
