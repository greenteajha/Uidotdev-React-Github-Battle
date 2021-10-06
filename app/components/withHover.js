import React from 'react'

export default function withHover (Component, propName = 'hovering') {
    return class withHover extends React.Component {
        constructor(props) {
            super(props)
    
            this.state = {
                hovering: false
            }
    
            this.mouseOver = this.mouseOver.bind(this)
            this.mouseOut = this.mouseOut.bind(this)
        }
    
        mouseOver(id) {
            this.setState({
                hovering: true
            })
        }
    
        mouseOut(id) {
            this.setState({
                hovering: false
            })
        }

        render () {
            // console.log('props', this.props)
            const props = {
                [propName]: this.state.hovering,
                ...this.props
            }

            return (
                <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                    <Component {...props} />
                </div>
            )
        }
    }
}