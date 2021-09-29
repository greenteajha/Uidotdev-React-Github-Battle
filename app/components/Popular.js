import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api"

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

function ReposGrid ({repos}) {
    return(
        <ul className='grid-space-around'>

            <pre>{JSON.stringify(repos, null, 2)}</pre>

            {repos.map((repos,index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repos
                const {login, avatar_url } = owner
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
                    this.setState(({ repos }) => ({
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
            {this.isLoading() && <p>LOADING</p>}
            {error && <p>{error}</p>}
            {repos[selectedLanguage] && <ReposGrid repos = {repos[selectedLanguage]} />}
            </React.Fragment>
        )
    }
}