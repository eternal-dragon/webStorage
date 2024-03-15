import React, { useContext, useEffect, useState } from 'react'
import './App.css'
import { Search, WebData } from './data/web'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, Card, Chip, Paper, Snackbar, TextField, Typography } from '@mui/material'
import { ShowTags, TagContext, TagData } from './data/tag'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

function App () {
    const ctx = useContext( TagContext )
    if ( !ctx ) {
        throw new Error( 'tagsData must be used within a tagsProvider' )
    }
    const [ webDatas, setWebDatas ] = useState<WebData[]>()
    const [ tags, setTags ] = useState<TagData[]>( [] )
    const [ exampleData, setExampleData ] = useState<WebData>( new WebData( 'http://www.baidu.com', [ '中文', '搜索' ], '百度', '谨防百度广告网页' ) )
    const [ newTag, setNewTag ] = useState<string>()
    const [ errorMessage, setErrorMessage ] = useState<string>()

    console.log( ctx.tags )
    console.log( ctx.tags.length )

    if ( ctx.tags === undefined || ctx.tags === null || !ctx.tags.length ) {
        return <div>加载中... tags</div>
    }

    const saveData = async () => {
        let saveData = exampleData
        saveData.Tags = tags.map( tag => tag.Name )

        try {
            let err = await saveData.save()
            setErrorMessage( err )
        } catch ( error ) {
            console.error( 'Unexpected error during save:', error )
        }
    }

    const delelteData = ( id: number | undefined ) => {
        if ( !webDatas || !id ) {
            return
        }
        const updatedWebDatas = webDatas.filter( ( data ) => data.ID !== id )
        setWebDatas( updatedWebDatas )
    }

    const searchData = () => {
        if ( !tags ) {
            alert( "请选择要搜索的tag" )
            return
        }
        Search( tags.map( tag => tag.Name ) )
            .then( datas => {
                setWebDatas( datas )
                console.log( datas )
            } )
            .catch( error => {
                console.error( 'Error searching:', error )
            } )
    }

    const addTag = ( tag: string ) => {
        if ( !tags.map( tag => tag.Name ).includes( tag ) ) {
            const newTags: TagData[] = [ ...tags, new TagData( tag ) ]
            setTags( newTags )
        }
    }

    const handleNameChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        setExampleData( ( prevData ) => ( {
            ...prevData,
            Name: event.target.value,
            save: prevData.save,
            delete: prevData.delete,
            show: prevData.show,
        } ) )
    }

    const handleUrlChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        setExampleData( ( prevData ) => ( {
            ...prevData,
            Url: event.target.value,
            save: prevData.save,
            delete: prevData.delete,
            show: prevData.show,
        } ) )
    }

    const handleDescriptionChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        setExampleData( ( prevData ) => ( {
            ...prevData,
            Description: event.target.value,
            save: prevData.save,
            delete: prevData.delete,
            show: prevData.show,
        } ) )
    }

    const DeleteTag = ( tag: string ) => {
        let deleteTag = new TagData( tag )
        deleteTag.delete()
        const newTags: TagData[] = ctx.tags.filter( ( t ) => t.Name !== tag )
        ctx.setTags( newTags )
    }

    const handleNewTagChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        setNewTag( event.target.value )
    }

    const saveTagData = async () => {
        if ( !newTag ) {
            return
        }

        let nt = new TagData( newTag )
        try {
            let err = await nt.save()
            setErrorMessage( err )
            if ( err === "success" ) {
                ctx.setTags( [ ...ctx.tags, nt ] )
            }
        } catch ( error ) {
            console.error( 'Unexpected error during save:', error )
        }
    }

    const getErrorMessage = () => {
        if ( errorMessage === "success" ) {
            return (
                <Alert
                    severity="success"
                    sx={ { width: '95%' } }
                >
                    成功！
                </Alert>
            )
        }
        return (
            <Alert
                severity="error"
                sx={ { width: '95%' } }
            >
                { errorMessage }
            </Alert>
        )
    }

    return (
        <div className='contentContainer'>
            <Snackbar
                open={ errorMessage !== undefined }
                autoHideDuration={ 6000 }
                onClose={ () => { setErrorMessage( undefined ) } }>
                { getErrorMessage() }
            </Snackbar>
            <Accordion>
                <AccordionSummary
                    expandIcon={ <ArrowDropDownIcon /> }
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography>新增数据</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper>
                        <Typography style={ { margin: '10px' } }>网站数据</Typography>
                        <TextField
                            required
                            label="Name"
                            value={ exampleData.Name }
                            onChange={ handleNameChange }
                            style={ { margin: '5px' } }
                        />
                        <TextField
                            required
                            label="Url"
                            value={ exampleData.Url }
                            onChange={ handleUrlChange }
                            style={ { margin: '5px' } }
                        />
                        <TextField
                            required
                            label="Description"
                            value={ exampleData.Description }
                            onChange={ handleDescriptionChange }
                            style={ { margin: '5px' } }
                        />
                        <br />
                        <ShowTags
                            options={ ctx.tags }
                            tags={ tags }
                            setTags={ ( tags ) => ( setTags( tags ) ) }
                        />
                        <Button
                            onClick={ saveData }
                            variant="outlined"
                            disabled={ tags.length === 0 }
                            style={ { margin: '5px' } }
                        >
                            { tags.length > 0 ? "保存" : "先选择标签再保存" }
                        </Button>
                    </Paper>
                    <br />
                    <Paper>
                        <Typography style={ { margin: '10px' } }>标签数据</Typography>
                        { ctx.tags && ctx.tags?.map( ( tag, index ) => (
                            <Chip
                                key={ index }
                                label={ tag.Name }
                                onClick={ () => addTag( tag.Name ) }
                                onDelete={ () => DeleteTag( tag.Name ) }
                                variant="outlined"
                                style={ { margin: '0.5rem' } }
                            />
                        ) ) }
                        <br />
                        <TextField
                            required
                            label="tag"
                            value={ newTag || '' }
                            onChange={ handleNewTagChange }
                            style={ { margin: '5px' } }
                        />
                        <Button
                            onClick={ saveTagData }
                            variant="outlined"
                            disabled={ !newTag || newTag.length === 0 }
                            style={ { margin: '5px' } }
                        >
                            新增
                        </Button>
                    </Paper>
                </AccordionDetails>
            </Accordion>
            <div>
                <ShowTags
                    options={ ctx.tags }
                    tags={ tags }
                    setTags={ ( tags ) => ( setTags( tags ) ) }
                />
                <Button
                    onClick={ searchData }
                    variant="outlined"
                    disabled={ tags.length === 0 }
                    style={ { margin: '5px' } }
                >
                    { tags.length > 0 ? "搜索" : "先选择标签再搜索" }
                </Button>
            </div>
            <br />
            {
                ctx.tags && ctx.tags?.map( ( tag, index ) => (
                    <Chip
                        key={ index }
                        label={ tag.Name }
                        onClick={ () => addTag( tag.Name ) }
                        variant="outlined"
                        style={ { margin: '0.5rem' } }
                    />
                ) )
            }
            <div>
                <h2>搜索结果:</h2>
                <ul>
                    { webDatas && webDatas.map( ( data ) => {
                        return data.show( ( tag: string ): void => { addTag( tag ) }, () => ( delelteData( data.ID ) ) )
                    } ) }
                </ul>
            </div>
            <div style={ { position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', background: '#fff', padding: '5px' } }>
                <a href="https://beian.miit.gov.cn" style={ { color: 'black' } }>
                    ICP备2023022447号-1
                </a>
            </div>
        </div >
    )
}

export default App
