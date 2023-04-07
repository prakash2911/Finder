import math

def get_destination(lat1, lon1, distance):
    R = 6371  
    d = distance / R  
    lat1, lon1 = math.radians(lat1), math.radians(lon1)  
    lat2 = math.asin(math.sin(lat1) * math.cos(d) + math.cos(lat1) * math.sin(d) * math.cos(0))
    lon2 = lon1 + math.atan2(math.sin(0) * math.sin(d) * math.cos(lat1), math.cos(d) - math.sin(lat1) * math.sin(lat2))
    lat2, lon2 = math.degrees(lat2), math.degrees(lon2)
    
    return lat2, lon2
