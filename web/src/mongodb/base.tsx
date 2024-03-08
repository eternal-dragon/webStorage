import { Button, Card, CardContent, Chip, Link, Tooltip, Typography } from "@mui/material"
import { api } from "../network/api"

export class WebData {
    public ID?: number
    public Name?: string
    public Url!: string // This is a single Primitive
    public Description?: string
    public Tags!: string[] // This is a Primitive Array

    constructor ( url: string, tags: string[], name?: string, description?: string ) {
        this.Name = name
        this.Url = url
        this.Description = description
        this.Tags = tags
    }

    public save () {
        api.post( `/web`, this )
            .then( response => {
                console.log( response.data )
            } )
            .catch( error => {
                console.error( 'Error add ' + this.Url + ':', error )
            } )
    }

    public delete () {
        if ( !this.ID ) {
            return
        }
        api.delete( `/web/` + this.ID )
            .then( response => {
                console.log( response.data )
            } )
            .catch( error => {
                console.error( 'Error delete ' + this.Url + ':', error )
            } )
    }

    public show ( addTag: ( tag: string ) => void ) {
        return (
            <Card>
                <CardContent>
                    <Tooltip title={
                        this.Description ? (
                            <Typography variant="body1">Description: { this.Description }</Typography>
                        ) : <div />
                    } arrow>
                        <Typography variant="h6">{ this.Name }</Typography>
                    </Tooltip>
                    <Link href={ this.Url }>{ this.Url }</Link>
                    <Typography variant="body2">
                        Tags:
                        { this.Tags?.map( ( tag, index ) => (
                            <Chip
                                key={ index }
                                label={ tag }
                                onClick={ () => addTag( tag ) }
                                variant="outlined"
                                style={ { margin: '0.5rem' } }
                            />
                        ) ) }
                    </Typography>
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
            return new WebData( data.Url, data.Tags, data.Name, data.Description )
        } )

        return webDataArray
    } catch ( error ) {
        console.error( 'Error search ' + tags.join( "," ) + ':', error )
        return []
    }
}
