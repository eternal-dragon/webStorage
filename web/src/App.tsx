import React, { useEffect, useState } from 'react'
import './App.css'
import { Search, WebData } from './mongodb/base'
import { Button, Chip } from '@mui/material'

function App () {
    const [ webDatas, setWebDatas ] = useState<WebData[]>()
    const [ tags, setTags ] = useState<string[]>( [] )
    const [ testTags ] = useState<string[]>( [ "中文", "搜索" ] )

    const saveData = () => {
        const Baidu = new WebData( 'www.baidu.com', '百度', [ '中文', '搜索' ] )
        Baidu.save()
    }
    const searchData = () => {
        if ( !tags ) {
            return
        }
        const datas = Search( tags )
        setWebDatas( datas )
        console.log( datas )
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

    return (
        <div>
            <button onClick={ saveData }>Save</button>
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
            <button onClick={ searchData }>Find</button>
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
                        return data.show( ( tag: string ): void => { addTag( tag ) } )
                    } ) }
                </ul>
            </div>
        </div>
    )
}

export default App
