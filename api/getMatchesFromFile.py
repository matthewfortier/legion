def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from
    # that
    return json.loads(lines[0])


def main():
    lines = read_in()

    # print(lines["command"])

    if lines["command"] == "getFiles":
        full = lines["path"] + lines["glob"]
        containing = lines["containing"]
        # print(full)
        getFiles(full, containing)


if __name__ == '__main__':
    main()
