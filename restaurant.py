from flask import Flask, flash, url_for, jsonify, request, render_template, session, redirect, g
import sys, os, flask
import model
from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
auth = HTTPBasicAuth()
app.secret_key = os.urandom(24)


def spcall(qry, param, commit=False):
    try:
        dbo = model.DBconn()
        cursor = dbo.getcursor()
        cursor.callproc(qry, param)
        res = cursor.fetchall()
        if commit:
            dbo.dbcommit()
        return res
    except:
        res = [("Error: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]),)]
    return res


# @auth.get_password
# def getpassword(username):
#     return 'akolagini'
#
#
# @app.route('/login/', methods=['POST'])
# def login():
#
#     params = request.get_json()
#     password = params["password"]
#     email = params["email"]
#
#     res = spcall('login', (email, password), True)
#     if 'Error' in str(res[0][0]):
#         return jsonify({'status': 'error'})
#
#     return jsonify({'status': 'ok'})
#
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        session.pop('user', None)

        if request.form['password'] == 'password':
            session['user'] = request.form['username']
            return redirect(url_for('restaurant'))

    return render_template('login.html')


@app.route('/restaurant')
def restaurant():
    if g.user:
        return render_template('restaurant.html')

    return redirect(url_for('index'))


@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']


@app.route('/getsession')
def getsession():
    if 'user' in session:
        return session['user']

    return 'Not logged in!'


@app.route('/reservation/', methods=['POST'])
def reservations():

    params = request.get_json()
    diner = params["diner"]
    cus_name = params["cus_name"]
    attendees = params["attendees"]
    res_date = params["res_date"]
    res_time = params["res_time"]

    res = spcall('reservations', (diner, cus_name, attendees, res_date, res_time), True)
    if 'Error' in res[0][0]:
        return jsonify({'status': 'error', 'message': res[0][0]})

    return jsonify({'status': 'ok', 'message': res[0][0]})


@app.route('/search/', methods=['GET', 'POST', 'PUT'])
def search_res():

    params = request.get_json()
    resname1 = params["resname1"]

    res = spcall('res_search', (resname1, 'random'), True)
    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []

    for r in res:
        recs.append({"resname1": r[0], "address": r[1], "contact": r[2]})

    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})


@app.route('/rating', methods=['POST'])
def rate():
    params = request.get_json()
    answer = params["answer"]
    diner = params["diner"]
    print(answer)
    print(diner)
    res = spcall('rate', (str(answer), str(diner)), True)

    if 'Error' in res[0][0]:
        return jsonify({'status': 'error', 'message': res[0][0]})
    return jsonify({'status': 'ok', 'message': res[0][0]})


@app.route('/my_reservation', methods=['GET'])
def myreservation():
    res = spcall('myreservation', (), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []
    for r in res:
        recs.append({"diner": str(r[0]), "cus_name": str(r[1]), "attendees": str(r[2]), "res_date": str(r[3]), "res_time": str(r[4])})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})


@app.route('/view_ratings', methods=['GET'])
def view_ratings():
    res = spcall('view_ratings', (), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []
    for r in res:
        recs.append({"diner_name": str(r[0]), "answer": str(r[1])})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})


@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get('Origin', '*')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Access-Control-Allow-Headers'] = flask.request.headers.get('Access-Control-Request-Headers',
                                                                             'Authorization')
    # set low for debugging

    if app.debug:
        resp.headers["Access-Control-Max-Age"] = '1'
    return resp

if __name__ == '__main__':
    app.run(debug=True)
