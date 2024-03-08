import React, { useEffect, useState } from 'react'
import './App.css'
import { Search, WebData } from './mongodb/base'
import { Button, Card, Chip, Paper, TextField, Typography } from '@mui/material'

function App () {
    const [ webDatas, setWebDatas ] = useState<WebData[]>()
    const [ tags, setTags ] = useState<string[]>( [] )
    const [ testTags ] = useState<string[]>( [ "中文", "搜索" ] )
    const [ exampleData, setExampleData ] = useState<WebData>( new WebData( 'http://www.baidu.com', [ '中文', '搜索' ], '百度', '谨防百度广告网页' ) )

    const saveData = () => {
        let saveData = exampleData
        saveData.Tags = tags
        saveData.save()
    }
    const searchData = () => {
        if ( !tags ) {
            alert( "请选择要搜索的tag" )
            return
        }
        Search( tags )
            .then( datas => {
                setWebDatas( datas )
                console.log( datas )
            } )
            .catch( error => {
                console.error( 'Error searching:', error )
            } )
    }
    const addTag = ( tag: string ) => {
        if ( !tags.includes( tag ) ) {
            const newTags: string[] = [ ...tags, tag ]
            setTags( newTags )
        }
    }
    const removeTag = ( tag: string ) => {
        const newTags: string[] = tags.filter( ( t ) => t !== tag )
        setTags( newTags )
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

    return (
        <div>
            <br />
            <Typography>新增网站数据</Typography>
            <Paper>
                <TextField
                    required
                    label="Name"
                    value={ exampleData.Name }
                    onChange={ handleNameChange }
                />
                <TextField
                    required
                    label="Url"
                    value={ exampleData.Url }
                    onChange={ handleUrlChange }
                />
                <TextField
                    required
                    label="Description"
                    value={ exampleData.Description }
                    onChange={ handleDescriptionChange }
                />
                <Button onClick={ saveData } variant="outlined">保存</Button>
            </Paper>
            <div>
                { tags.map( ( tag, index ) => (
                    <Chip
                        key={ index }
                        label={ tag }
                        onDelete={ () => removeTag( tag ) }
                        style={ { margin: '0.5rem' } }
                    />
                ) ) }
            </div>
            <Button onClick={ searchData } variant="outlined">搜索</Button>
            { testTags?.map( ( tag, index ) => (
                <Chip
                    key={ index }
                    label={ tag }
                    onClick={ () => addTag( tag ) }
                    variant="outlined"
                    style={ { margin: '0.5rem' } }
                />
            ) ) }
            <div>
                <h2>Web Data:</h2>
                <ul>
                    { webDatas && webDatas.map( ( data ) => {
                        console.log( data )
                        return data.show( ( tag: string ): void => { addTag( tag ) } )
                    } ) }
                </ul>
            </div>
            <div style={ { display: "flex", justifyContent: "center" } }>
                <a href="https://beian.miit.gov.cn" style={ { color: 'black' } }>
                    ICP备2023022447号-1
                </a>
            </div>
        </div>
    )
}

export default App
