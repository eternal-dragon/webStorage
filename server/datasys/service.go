package datasys

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/mongodb"
	"server/util"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

func HandleAdd(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	_, role, err := util.GetUser(w, r)
	if err != nil {
		logrus.Error(util.Errorf("get user failed").WithCause(err))
		return
	}
	if role < util.RoleManager {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	webJson := r.Body
	decoder := json.NewDecoder(webJson)
	var webData mongodb.WebData
	if err := decoder.Decode(&webData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err.Error())
		return
	}

	if _, err := mongodb.AddWebData(webData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "success")
}

func HandleSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	tagsString := mux.Vars(r)["tags"]
	tags := strings.Split(tagsString, ",")

	webDatas, err := mongodb.GetWebDataByTags(tags)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, util.EncodeJson(webDatas))
}

func HandleDelete(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	_, role, err := util.GetUser(w, r)
	if err != nil {
		logrus.Error(util.Errorf("get user failed").WithCause(err))
		return
	}
	if role < util.RoleManager {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	idString := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idString)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err.Error())
		return
	}

	err = mongodb.DeleteWebData(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "success")
}
