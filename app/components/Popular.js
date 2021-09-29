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
            {this.isLoading() && <p>LOADING</p>}
            {error && <p>{error}</p>}
            {repos[selectedLanguage] && <pre>{JSON.stringify(repos[selectedLanguage], null, 2)}</pre>}
            </React.Fragment>
        )
    }
}