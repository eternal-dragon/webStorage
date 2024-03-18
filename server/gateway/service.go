package gateway

import (
	"net/http"

	"github.com/gorilla/mux"

	"server/datasys"
	"server/usersys"
)

const pathPerfix = "/v1"

func NewService(router *mux.Router) {
	// user
	router.HandleFunc(pathPerfix+"/register", usersys.HandleRegister).Methods(http.MethodPost)
	router.HandleFunc(pathPerfix+"/login", usersys.HandleLogin).Methods(http.MethodPost)

	// web data
	router.HandleFunc(pathPerfix+"/web", datasys.HandleAddWeb).Methods(http.MethodPost)
	router.HandleFunc(pathPerfix+"/web/{tags}", datasys.HandleSearchWeb).Methods(http.MethodGet)
	router.HandleFunc(pathPerfix+"/web/{id}", datasys.HandleDeleteWeb).Methods(http.MethodDelete)
	router.HandleFunc(pathPerfix+"/web/{id}", datasys.HandlePatchWeb).Methods(http.MethodPatch)

	//tag data
	router.HandleFunc(pathPerfix+"/tag", datasys.HandleAddTag).Methods(http.MethodPost)
	router.HandleFunc(pathPerfix+"/tag", datasys.HandleGetAllTags).Methods(http.MethodGet)
	router.HandleFunc(pathPerfix+"/tag/{name}", datasys.HandleDeleteTag).Methods(http.MethodDelete)
}
