from pandas import DataFrame


def create_csv_file(data):
    output = {"type": [], "number": [], "audience": [], "building": [], "address": [], "description": [], "status": []}
    for record in data:
        output["type"].append(record.type)
        output["number"].append(record.number)
        output["audience"].append(record.audience)
        output["building"].append(record.building)
        output["address"].append(record.address)
        output["description"].append(record.description)
        output["status"].append(record.status)
    return DataFrame(data=output).to_csv()

