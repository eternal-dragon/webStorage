package util

import (
	"encoding/gob"
	"net/http"

	"github.com/gorilla/sessions"
)

var sessionName = "session"
var key = []byte("super-secret-key")
var sessionStore = sessions.NewCookieStore(key)

// session values
const (
	sessionUser = "user"
	sessionRole = "role"
	sessionHero = "hero"
)

type RoleLevel int

const (
	RolePlayer RoleLevel = iota
	RoleManager
	RoleAdmin
)

func init() {
	sessionStore.Options.SameSite = http.SameSiteStrictMode
	gob.Register(RolePlayer)
}

func AddSession(w http.ResponseWriter, r *http.Request, user string, role RoleLevel) error {
	session, err := sessionStore.Get(r, sessionName)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return err
	}
	session.Values[sessionUser] = user
	session.Values[sessionRole] = role
	err = session.Save(r, w)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return err
	}
	return nil
}

func GetUser(w http.ResponseWriter, r *http.Request) (user string, role RoleLevel, err error) {
	session, err := sessionStore.Get(r, sessionName)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return "", 0, err
	}
	if session.IsNew {
		w.WriteHeader(http.StatusUnauthorized)
		return "", 0, Errorf("登录信息已失效")
	}
	if _, ok := session.Values[sessionUser]; !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return "", 0, Errorf("登录信息已失效")
	}
	return session.Values[sessionUser].(string),
		session.Values[sessionRole].(RoleLevel),
		nil
}
