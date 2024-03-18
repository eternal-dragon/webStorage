import { FC, ReactNode, createContext, useEffect, useState } from "react"
import { api } from "../network/api"
import { Autocomplete, Chip, TextField, createFilterOptions } from "@mui/material"

export class TagData {
    public Name!: string

    constructor ( name: string ) {
        this.Name = name
    }


    public async save (): Promise<string> {
        try {
            const response = await api.post( `/tag`, this )
            console.log( response.data )
            return 'success'
        } catch ( error: any ) {
            if ( error.response.status === 409 ) {
                return `${ this.Name } 标签已存在`
            }
            return `Error adding tag ${ this.Name }: ${ error }`
        }
    }

    public delete () {
        api.delete( `/tag/` + this.Name )
            .then( response => {
                console.log( response.data )
            } )
            .catch( error => {
                console.log( 'Error delete tag ' + this.Name + ':' + error )
            } )
    }
}

interface TagContextProps {
    tags: TagData[]
    setTags: ( newtags: TagData[] ) => void
}

export const TagContext = createContext<TagContextProps | undefined>( undefined )

export const TagProvider: FC<{ children: ReactNode }> = ( { children } ) => {
    const [ tags, setTagsInternal ] = useState<TagData[]>( () => {
        const storedTags = localStorage.getItem( "tags" )
        return storedTags ? JSON.parse( storedTags ) : {}
    } )

    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await api.get( `/tag` )
                console.log( response.data )
                if ( !response.data ) {
                    setTagsInternal( [ new TagData( "中文" ), new TagData( "搜索" ) ] )
                    return
                }

                // 创建 WebData 数组
                let tags: TagData[] = response.data.map( ( data: TagData ) => {
                    return new TagData( data.Name )
                } )

                // 使用更新函数确保不会覆盖旧状态
                setTagsInternal( tags )
            } catch ( error ) {
                console.error( `Error getting tags data:`, error )
            }
        }

        fetchData()
    }, [] )
    console.log( tags )


    // 将 Tags 存储到 localStorage
    useEffect( () => {
        if ( tags !== null ) {
            localStorage.setItem( "tags", JSON.stringify( tags ) )
        } else {
            localStorage.removeItem( 'tags' )
        }
    }, [ tags ] )

    const setTags = ( newtags: TagData[] ) => {
        setTagsInternal( newtags )
    }

    return (
        <TagContext.Provider value={ { tags, setTags } }>
            { children }
        </TagContext.Provider>
    )
}

interface ShowTagsProps {
    options: TagData[],
    tags: TagData[],
    setTags: ( tags: TagData[] ) => void,
}

export function ShowTags ( { options, tags, setTags }: ShowTagsProps ) {
    return (
        <Autocomplete
            multiple
            id="tags-search"
            options={ options }
            filterSelectedOptions
            isOptionEqualToValue={ ( option, value ) => option.Name === value.Name }
            value={ tags }
            getOptionLabel={ ( option: TagData ) => option.Name }
            onChange={ ( event, value: TagData[] | null ) => setTags( value ? value : [] ) }
            renderInput={ ( params ) => (
                <TextField
                    { ...params }
                    variant="outlined"
                    label="搜索标签"
                    placeholder="请选择标签"
                />
            ) }
            renderTags={ ( value: TagData[], getTagProps ) =>
                value.map( ( tag: TagData, index: number ) => (
                    <Chip
                        { ...getTagProps( { index } ) }
                        key={ index }
                        label={ tag.Name }
                        style={ { margin: '0.5rem' } }
                    />
                ) )
            }
        />
    )
}
