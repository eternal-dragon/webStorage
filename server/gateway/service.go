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
	router.HandleFunc(pathPerfix+"/web", datasys.HandleAdd).Methods(http.MethodPost)
	router.HandleFunc(pathPerfix+"/web/{tags}", datasys.HandleSearch).Methods(http.MethodGet)
	router.HandleFunc(pathPerfix+"/web/{id}", datasys.HandleDelete).Methods(http.MethodDelete)
}
