import { Button, Card, CardContent, Chip, Tooltip, Typography } from "@mui/material"
import { api } from "../network/api"

export class WebData {
    public id?: number
    public name?: string
    public url!: string // This is a single Primitive
    public description?: string
    public tags?: string[] // This is a Primitive Array

    constructor ( url: string, name?: string, tags?: string[], description?: string ) {
        this.name = name
        this.url = url
        this.description = description
        this.tags = tags
    }

    public save () {
        api.post( `/web`, this )
            .then( response => {
                console.log( response.data )
            } )
            .catch( error => {
                console.error( 'Error add ' + this.url + ':', error )
            } )
    }

    public delete () {
        if ( !this.id ) {
            return
        }
        api.delete( `/web/` + this.id )
            .then( response => {
                console.log( response.data )
            } )
            .catch( error => {
                console.error( 'Error delete ' + this.url + ':', error )
            } )
    }

    public show ( addTag: ( tag: string ) => void ) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">{ this.name }</Typography>
                    { this.description && (
                        <Tooltip title={ this.description } arrow>
                            <Typography variant="body1">Description: { this.description }</Typography>
                        </Tooltip>
                    ) }
                    <Typography variant="body2">URL: { this.url }</Typography>
                    <Typography variant="body2">
                        Tags:
                        { this.tags?.map( ( tag, index ) => (
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

export function Search ( tags: string[] ): WebData[] {
    api.get( `/web/` + tags.join( "," ) )
        .then( response => {
            return response.data
        } )
        .catch( error => {
            console.error( 'Error search ' + tags.join( "," ) + ':', error )
        } )
    return []
}
