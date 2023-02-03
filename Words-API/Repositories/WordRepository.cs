using Words_API.Data;

namespace Words_API.Repositories;

public class WordRepository
{
    private DataService DataService;

    public WordRepository(DataService dataService)
    {
        this.DataService = dataService;
    }

    public IEnumerable<string> GetAllWords()
    {
        return this.DataService.words;
    }
}
