import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api"
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle, FaCode } from 'react-icons/fa'
import Card from './Card'
import Loading from "./Loading";

function LanguageNav ({ selected, onUpdateLanguage }){
    const languages = ['All','JavaScript','Ruby','Java','CSS','Python']

    return (
        <ul className='flex-center'>
            {languages.map((language,index) => (
                <li key={language}>
                    <button 
                    className='btn-clear nav-link'
                    style={language === selected ? { color: 'rgb(187, 46, 31'} : null}
                    onClick={() => onUpdateLanguage(language)}>
                        {language}
                    </button>
                </li>
            ))}
        </ul>
    )
}

LanguageNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired,
}
//<pre>{JSON.stringify(repos, null, 2)}</pre>
function ReposGrid ({repos}) {
    return(
        <ul className='grid space-around'>
            {repos.map((repos,index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repos
                const {login, avatar_url } = owner

                return(
                    <li key={html_url}>
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={login}
                        >
                            <ul className='card-list'>
                                <li>
                                    <FaUser color='rgb(255, 191, 116' size={22} />
                                    <a href={`https://github.com/${login}`}>
                                        {login}
                                    </a>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size={22} />
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size={22}/>
                                    {forks.toLocaleString()} forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 138, 147)' size={22}/>
                                    {open_issues.toLocaleString()} open
                                </li>
                            </ul>
                        </Card>
                    </li>
                )
            })}
            
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

export default class Popular extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            selectedLanguage: 'All',
            repos: {},
            error: null
        }

    this.updateLanguage = this.updateLanguage.bind(this)
    this.isLoading = this.isLoading.bind(this)

    }

    componentDidMount(){
        this.updateLanguage(this.state.selectedLanguage)
    }

    
    updateLanguage(selectedLanguage){
        this.setState({
            selectedLanguage,
            error: null,
        })

        if(!this.state.repos[selectedLanguage]){
            fetchPopularRepos(selectedLanguage)
                .then((data) => {

/* 
The variable being pass to setState is a prop, therefore the 
need to wrap it in curly bracers before passing it into the arrow function
*/
                    
                    this.setState(({repos}) => ({

/*
Because curly braces are used to denote the function’s body, 
an arrow function that wants to return an object literal outside of a 
function body must wrap the literal in parentheses. 
*/

                        repos: {
                            ...repos,
                            [selectedLanguage]: data
                        }
                    }))
                })
                .catch(() => {
                    console.warn('Error fetching repos: ', error)

                    this.setState({
                        error: 'There was an error fetching the repositories.'
                    })
                })       
        }    
    }

    isLoading(){
        const { selectedLanguage, repos, error } = this.state

        return !repos[selectedLanguage] && this.state.error === null
    }

    render() {
        const { selectedLanguage, repos, error } = this.state

        return (
            <React.Fragment>
                <LanguageNav 
                    selected = {selectedLanguage}
                    onUpdateLanguage = {this.updateLanguage}
                />
            {this.isLoading() && <Loading text='Fetching results' speed='50'/>}
            {error && <p className='center-text error'>{error}</p>}
            {repos[selectedLanguage] && <ReposGrid repos = {repos[selectedLanguage]} />}
            </React.Fragment>
        )
    }
}