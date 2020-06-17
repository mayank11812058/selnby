import React, {Component} from 'react'

class Footer extends Component{
    render(){
        return (
            <footer className="fixed-bottom footer mt-2 p-2 text-dark text-center w-100" style={{zIndex : "10"}}>
                Copyright &copy; {new Date().getFullYear()} SelNBy
            </footer>
        );
    }
}

export default Footer;
