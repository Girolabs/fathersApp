import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import  { Formik, Form } from 'formik';
import * as Yup  from 'yup';
import InputWithFormik from '../components/InputWithFormik';


class FatherFormScreen extends Component {

    

    render() {
        return(
            <Formik 
                initialValues={{ email:'ola'}} 
                onSubmit={values => console.log(values)}

            >
                <Fragment>
                <InputWithFormik
                        label='email'
                        name='email'
                    />
                    <InputWithFormik
                        label='contactNotes'
                        name='contactNotes'
                    />
                </Fragment>
                   
            </Formik>
        )
    }

    
}

export default FatherFormScreen;