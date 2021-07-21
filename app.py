import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask import render_template, redirect


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///SQL/SGU.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Install = Base.classes.installation
Output = Base.classes.output
Income = Base.classes.income
Rebate = Base.classes.rebate
Suburbs = Base.classes.suburbs
SGU = Base.classes.sgu
STATE = Base.classes.state
Rdata = Base.classes.rdatav2

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
@app.route("/home")
def home():

    # Return template and data
    return render_template("index.html")




@app.route("/about")
def about():

    # Return template and data
    return render_template("about.html")




@app.route("/national")
def national():

    # Return template and data
    return render_template("national.html")




@app.route("/map")
def map():

    # Return template and data
    return render_template("map.html")





@app.route("/api/v1.0/install")
def installs():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of install data"""
    # Query all outputs
    results = session.query(Install.postcode, Install._2001, Install._2002, Install._2003, Install._2004, Install._2005, Install._2006, Install._2007, Install._2008, Install._2009, Install._2010,
                            Install._2011, Install._2012, Install._2013, Install._2014, Install._2015, Install._2016, Install._2017, Install._2018, Install._2019, Install._2020, Install._2021, Install.AVG, Install.Total).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_installs = []
    for postcode, _2001, _2002, _2003, _2004, _2005, _2006, _2007, _2008, _2009, _2010, _2011, _2012, _2013, _2014, _2015, _2016, _2017, _2018, _2019, _2020, _2021, AVG, Total in results:
        install_dict = {}
        install_dict["postcode"] = postcode
        install_dict["_2001"] = _2001
        install_dict["_2002"] = _2002
        install_dict["_2003"] = _2003
        install_dict["_2004"] = _2004
        install_dict["_2005"] = _2005
        install_dict["_2006"] = _2006
        install_dict["_2007"] = _2007
        install_dict["_2007"] = _2007
        install_dict["_2008"] = _2008
        install_dict["_2009"] = _2009
        install_dict["_2010"] = _2010
        install_dict["_2011"] = _2011
        install_dict["_2012"] = _2012
        install_dict["_2013"] = _2013
        install_dict["_2014"] = _2014
        install_dict["_2015"] = _2015
        install_dict["_2016"] = _2016
        install_dict["_2017"] = _2017
        install_dict["_2018"] = _2018
        install_dict["_2019"] = _2019
        install_dict["_2020"] = _2020
        install_dict["_2021"] = _2021
        install_dict["AVG"] = AVG
        install_dict["Total"] = Total
        all_installs.append(install_dict)

    return jsonify(all_installs)






@app.route("/api/v1.0/output")
def outputs():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of output data"""
    # Query all outputs
    results = session.query(Output.postcode, Output._2001, Output._2002, Output._2003, Output._2004, Output._2005, Output._2006, Output._2007, Output._2008, Output._2009, Output._2010,
                            Output._2011, Output._2012, Output._2013, Output._2014, Output._2015, Output._2016, Output._2017, Output._2018, Output._2019, Output._2020, Output._2021, Output.AVG, Output.Total).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_outputs = []
    for postcode, _2001, _2002, _2003, _2004, _2005, _2006, _2007, _2008, _2009, _2010, _2011, _2012, _2013, _2014, _2015, _2016, _2017, _2018, _2019, _2020, _2021, AVG, Total in results:
        output_dict = {}
        output_dict["postcode"] = postcode
        output_dict["_2001"] = _2001
        output_dict["_2002"] = _2002
        output_dict["_2003"] = _2003
        output_dict["_2004"] = _2004
        output_dict["_2005"] = _2005
        output_dict["_2006"] = _2006
        output_dict["_2007"] = _2007
        output_dict["_2007"] = _2007
        output_dict["_2008"] = _2008
        output_dict["_2009"] = _2009
        output_dict["_2010"] = _2010
        output_dict["_2011"] = _2011
        output_dict["_2012"] = _2012
        output_dict["_2013"] = _2013
        output_dict["_2014"] = _2014
        output_dict["_2015"] = _2015
        output_dict["_2016"] = _2016
        output_dict["_2017"] = _2017
        output_dict["_2018"] = _2018
        output_dict["_2019"] = _2019
        output_dict["_2020"] = _2020
        output_dict["_2021"] = _2021
        output_dict["AVG"] = AVG
        output_dict["Total"] = Total
        all_outputs.append(output_dict)

    return jsonify(all_outputs)






@app.route("/api/v1.0/income")
def incomes():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of income data"""
    # Query all outputs
    results = session.query(
        Income.Postcode, Income.Average_total, Income.Average_salary).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_incomes = []
    for Postcode, Average_total, Average_salary in results:
        income_dict = {}
        income_dict["postcode"] = Postcode
        income_dict["Average_total"] = Average_total
        income_dict["Average_salary"] = Average_salary
        all_incomes.append(income_dict)

    return jsonify(all_incomes)






@app.route("/api/v1.0/rebate")
def rebates():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of rebate data """
    # Query all outputs
    results = session.query(Rebate.postcode, Rebate.zone,
                            Rebate.rating, Rebate.annual_prod, Rebate.rebate).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_rebates = []
    for postcode, zone, rating, annual_prod, rebate in results:
        rebate_dict = {}
        rebate_dict["postcode"] = postcode
        rebate_dict["zone"] = zone
        rebate_dict["rating"] = rating
        rebate_dict["annual_prod"] = annual_prod
        rebate_dict["rebate"] = rebate
        all_rebates.append(rebate_dict)

    return jsonify(all_rebates)






@app.route("/api/v1.0/suburbs")
def suburbs():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of suburb data """
    # Query all outputs
    results = session.query(Suburbs.postcode, Suburbs.suburb_id, Suburbs.suburb,
                            Suburbs.state, Suburbs.long, Suburbs.lat).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_suburbs = []
    for postcode, suburb_id, suburb, state, long, lat in results:
        suburb_dict = {}
        suburb_dict["postcode"] = postcode
        suburb_dict["suburb_id"] = suburb_id
        suburb_dict["suburb"] = suburb
        suburb_dict["state"] = state
        suburb_dict["lat"] = lat
        suburb_dict["long"] = long
        all_suburbs.append(suburb_dict)

    return jsonify(all_suburbs)



@app.route("/api/v1.0/mapdata")
def mapData():

# Create our session (link) from Python to the DB
    session = Session(engine)

    sel = [Suburbs.suburb, Suburbs.postcode, Suburbs.lat, Suburbs.long, Income.Average_total, Income.Postcode, Rebate.rebate, Rebate.postcode]
    result1 = session.query(*sel).filter((Suburbs.postcode == Income.Postcode) & (Suburbs.postcode == Rebate.postcode)).all()
    result1 = pd.DataFrame(result1)

    result2 = pd.DataFrame(session.query(Install.Total, Install.postcode).all())
    result2.rename(columns= {"Total": "total_installs"}, inplace=True)
    
    result3 = pd.DataFrame(session.query(Output.Total, Output.postcode).all())
    result3.rename(columns= {"Total": "total_output"}, inplace=True)
    
    session.close()

    merged = pd.merge(result1, result2, how="left", left_on="Postcode", right_on="postcode")
    merged.drop(['postcode_x', 'postcode_y'], axis=1, inplace=True)

    merged = pd.merge(merged, result3, how="left", left_on="Postcode", right_on="postcode")
    merged.drop('Postcode', axis=1, inplace=True)

    return merged.to_json(orient = "records")


@app.route("/api/v1.0/sgu")
def sgu():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of sgu data """
    # Query all sgu
    results = session.query(SGU.postcode,SGU.Installation_2001,SGU.Installation_2002,SGU.Installation_2003,SGU.Installation_2004,SGU.Installation_2005,
    SGU.Installation_2006,SGU.Installation_2007,SGU.Installation_2008,SGU.Installation_2009,SGU.Installation_2010,SGU.Installation_2011,SGU.Installation_2012,
    SGU.Installation_2013,SGU.Installation_2014,SGU.Installation_2015,SGU.Installation_2016,SGU.Installation_2017,SGU.Installation_2018,SGU.Installation_2019,
    SGU.Installation_2020,SGU.Installation_2021,SGU.Output_2001,SGU.Output_2002,SGU.Output_2003,SGU.Output_2004,SGU.Output_2005,SGU.Output_2006,SGU.Output_2007,
    SGU.Output_2008,SGU.Output_2009,SGU.Output_2010,SGU.Output_2011,SGU.Output_2012,SGU.Output_2013,SGU.Output_2014,SGU.Output_2015,SGU.Output_2016,SGU.Output_2017,
    SGU.Output_2018,SGU.Output_2019,SGU.Output_2020,SGU.Output_2021,SGU.Installation_Total,SGU.Installation_AVG,SGU.Output_Total,SGU.Output_AVG,SGU.zone,SGU.rating,
    SGU.annual_prod,SGU.rebate,SGU.Average_total,SGU.Average_salary,SGU.suburb,SGU.state).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_sgu =[]
    for postcode,Installation_2001,Installation_2002,Installation_2003,Installation_2004,Installation_2005,Installation_2006,Installation_2007,Installation_2008,\
        Installation_2009,Installation_2010,Installation_2011,Installation_2012,Installation_2013,Installation_2014,Installation_2015,Installation_2016,\
        Installation_2017,Installation_2018,Installation_2019,Installation_2020,Installation_2021,Output_2001,Output_2002,Output_2003,Output_2004,Output_2005,\
        Output_2006,Output_2007,Output_2008,Output_2009,Output_2010,Output_2011,Output_2012,Output_2013,Output_2014,Output_2015,Output_2016,Output_2017,Output_2018,\
        Output_2019,Output_2020,Output_2021,Installation_Total,Installation_AVG,Output_Total,Output_AVG,zone,rating,annual_prod,rebate,Average_total,Average_salary,\
        suburb,state in results:

        sgu_dict = {}
        sgu_dict["postcode"] =postcode
        
        
        ins_years ={ 2001: Installation_2001, 2002: Installation_2002, 2003: Installation_2003, 2004: Installation_2004,
        2005: Installation_2005, 2006: Installation_2006, 2007 : Installation_2007, 2008: Installation_2008, 
        2009: Installation_2009, 2010: Installation_2010, 2011:Installation_2011, 2012: Installation_2012,
        2013: Installation_2013, 2014: Installation_2014, 2015: Installation_2015, 2016: Installation_2016,
        2017: Installation_2017, 2018: Installation_2018, 2019: Installation_2019, 2020: Installation_2020,
        2021: Installation_2021}
        ins_dict ={'years': ins_years, 'AVG': Installation_AVG, 'Total': Installation_Total}
 
        sgu_dict["install"] = ins_dict

        out_years ={ 2001: Output_2001, 2002: Output_2002, 2003: Output_2003, 2004: Output_2004,
        2005: Output_2005, 2006: Output_2006, 2007 : Output_2007, 2008: Output_2008, 
        2009: Output_2009, 2010: Output_2010, 2011: Output_2011, 2012: Output_2012,
        2013: Output_2013, 2014: Output_2014, 2015: Output_2015, 2016: Output_2016,
        2017: Output_2017, 2018: Output_2018, 2019: Output_2019, 2020: Output_2020,
        2021: Output_2021}
        out_dict ={'years': out_years, 'AVG': Output_AVG, 'Total': Output_Total}
 
        sgu_dict["output"] = out_dict

        sgu_dict["zone"] =zone
        sgu_dict["rating"] =rating
        sgu_dict["annual_prod"] =annual_prod
        sgu_dict["rebate"] =rebate
        sgu_dict["Average_total"] =Average_total
        sgu_dict["Average_salary"] =Average_salary
        sgu_dict["suburb"] =suburb
        sgu_dict["state"] =state
        all_sgu.append(sgu_dict)


    return jsonify(all_sgu)


@app.route("/api/v1.0/state")
def state():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of sgu data """
    # Query all sgu
    results = session.query(STATE.state,STATE.Installation_2001,STATE.Installation_2002,STATE.Installation_2003,STATE.Installation_2004,STATE.Installation_2005,
    STATE.Installation_2006,STATE.Installation_2007,STATE.Installation_2008,STATE.Installation_2009,STATE.Installation_2010,STATE.Installation_2011,STATE.Installation_2012,
    STATE.Installation_2013,STATE.Installation_2014,STATE.Installation_2015,STATE.Installation_2016,STATE.Installation_2017,STATE.Installation_2018,STATE.Installation_2019,
    STATE.Installation_2020,STATE.Installation_2021,STATE.Output_2001,STATE.Output_2002,STATE.Output_2003,STATE.Output_2004,STATE.Output_2005,STATE.Output_2006,STATE.Output_2007,
    STATE.Output_2008,STATE.Output_2009,STATE.Output_2010,STATE.Output_2011,STATE.Output_2012,STATE.Output_2013,STATE.Output_2014,STATE.Output_2015,STATE.Output_2016,STATE.Output_2017,
    STATE.Output_2018,STATE.Output_2019,STATE.Output_2020,STATE.Output_2021,STATE.Installation_Total,STATE.Installation_AVG,STATE.Output_Total,STATE.Output_AVG,STATE.rebate_AVG,
    STATE.weekly_income_AVG).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_states =[]
    for state,Installation_2001,Installation_2002,Installation_2003,Installation_2004,Installation_2005,Installation_2006,Installation_2007,Installation_2008,\
        Installation_2009,Installation_2010,Installation_2011,Installation_2012,Installation_2013,Installation_2014,Installation_2015,Installation_2016,\
        Installation_2017,Installation_2018,Installation_2019,Installation_2020,Installation_2021,Output_2001,Output_2002,Output_2003,Output_2004,Output_2005,\
        Output_2006,Output_2007,Output_2008,Output_2009,Output_2010,Output_2011,Output_2012,Output_2013,Output_2014,Output_2015,Output_2016,Output_2017,Output_2018,\
        Output_2019,Output_2020,Output_2021,Installation_Total,Installation_AVG,Output_Total,Output_AVG,rebate_AVG,weekly_income_AVG in results:

        state_dict = {}
        state_dict["state"] =state
        
        
        ins_years ={ 2001: Installation_2001, 2002: Installation_2002, 2003: Installation_2003, 2004: Installation_2004,
        2005: Installation_2005, 2006: Installation_2006, 2007 : Installation_2007, 2008: Installation_2008, 
        2009: Installation_2009, 2010: Installation_2010, 2011:Installation_2011, 2012: Installation_2012,
        2013: Installation_2013, 2014: Installation_2014, 2015: Installation_2015, 2016: Installation_2016,
        2017: Installation_2017, 2018: Installation_2018, 2019: Installation_2019, 2020: Installation_2020,
        2021: Installation_2021}
        ins_dict ={'years': ins_years, 'AVG': Installation_AVG, 'Total': Installation_Total}
 
        state_dict["install"] = ins_dict

        out_years ={ 2001: Output_2001, 2002: Output_2002, 2003: Output_2003, 2004: Output_2004,
        2005: Output_2005, 2006: Output_2006, 2007 : Output_2007, 2008: Output_2008, 
        2009: Output_2009, 2010: Output_2010, 2011: Output_2011, 2012: Output_2012,
        2013: Output_2013, 2014: Output_2014, 2015: Output_2015, 2016: Output_2016,
        2017: Output_2017, 2018: Output_2018, 2019: Output_2019, 2020: Output_2020,
        2021: Output_2021}
        out_dict ={'years': out_years, 'AVG': Output_AVG, 'Total': Output_Total}
 
        state_dict["output"] = out_dict

        state_dict["rebate_avg"] = rebate_AVG
        state_dict["weekly_income_AVG"] = weekly_income_AVG


        all_states.append(state_dict)


    return jsonify(all_states)

@app.route("/api/v1.0/rdata")
def rdata():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of income data"""
    # Query all outputs
    results = session.query(
        Rdata.postcode, Rdata.ins_avg, Rdata.ins_total, Rdata.out_avg, Rdata.out_total, Rdata.suburb, Rdata.state, Rdata.location).all()

    session.close()

    # Create a dictionary from the row data and append to a list
    all_rdata = []
    for postcode, ins_avg, ins_total,out_avg,out_total,suburb,state,location in results:
        rdata_dict = {}
        rdata_dict["postcode"] = postcode
        rdata_dict["ins_avg"] = ins_avg
        rdata_dict["ins_total"] = ins_total
        rdata_dict["out_avg"] = out_avg
        rdata_dict["out_total"] = out_total
        rdata_dict["suburb"] = suburb
        rdata_dict["state"] = state
        rdata_dict["location"] = location
        all_rdata.append(rdata_dict)

    return jsonify(all_rdata)



if __name__ == '__main__':
    app.run(port=5500, debug=True)