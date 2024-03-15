import { Button, Card, CardContent, Chip, IconButton, Link, Tooltip, Typography } from "@mui/material"
import { api } from "../network/api"
import { MdDelete } from "react-icons/md"

export class WebData {
    public ID?: number
    public Name?: string
    public Url!: string // This is a single Primitive
    public Description?: string
    public Tags!: string[] // This is a Primitive Array

    constructor ( url: string, tags: string[], name?: string, description?: string, id?: number ) {
        this.Name = name
        this.Url = url
        this.Description = description
        this.Tags = tags
        this.ID = id
    }

    public async save (): Promise<string> {
        try {
            const response = await api.post( `/web`, this )
            console.log( response.data )
            return 'success'
        } catch ( error: any ) {
            if ( error.response.status === 409 ) {
                return `${ this.Url } 网址已存在`
            }
            return 'Error add web ' + this.Url + ':' + error
        }
    }

    public delete () {
        console.log( this )
        if ( !this.ID ) {
            return
        }
        api.delete( `/web/` + this.ID )
            .then( response => {
                console.log( response.data )
            } )
            .catch( error => {
                console.log( 'Error delete web ' + this.Url + ':' + error )
            } )
    }

    public show ( addTag: ( tag: string ) => void, deleteData: () => void ) {
        return (
            <Card key={ this.ID } style={ { margin: '5px' } }>
                <CardContent>
                    <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
                        <Tooltip title={
                            this.Description ? (
                                <Typography variant="body1">Description: { this.Description }</Typography>
                            ) : null
                        } arrow>
                            <Typography variant="h6">{ this.Name }</Typography>
                        </Tooltip>
                        <IconButton onClick={ () => {
                            this.delete()
                            deleteData()
                        } }>
                            <MdDelete />
                        </IconButton>

                    </div>
                    <Link href={ this.Url } target="_blank" rel="noopener noreferrer">{ this.Url }</Link>

                    <div style={ { display: 'flex', alignItems: 'center' } }>
                        <Typography variant="body2">
                            Tags:
                        </Typography>
                        { this.Tags?.map( ( tag, index ) => (
                            <Chip
                                key={ index }
                                label={ tag }
                                onClick={ () => addTag( tag ) }
                                variant="outlined"
                                style={ { margin: '0.5rem' } }
                            />
                        ) ) }
                    </div>
                </CardContent>
            </Card>
        )
    }
}

export async function Search ( tags: string[] ): Promise<WebData[]> {
    try {
        const response = await api.get( `/web/` + tags.join( "," ) )
        console.log( response.data )

        // 创建 WebData 数组
        const webDataArray: WebData[] = response.data.map( ( data: WebData ) => {
            return new WebData( data.Url, data.Tags, data.Name, data.Description, data.ID )
        } )

        return webDataArray
    } catch ( error ) {
        console.error( 'Error search ' + tags.join( "," ) + ':', error )
        return []
    }
}
