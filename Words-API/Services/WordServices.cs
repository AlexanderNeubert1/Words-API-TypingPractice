using Words_API.Repositories;

namespace Words_API.Services;

public class WordService
{
    private WordRepository WordRepository;

    public WordService(WordRepository wordRepository)
    {
        this.WordRepository = wordRepository;
    }

    public IEnumerable<string> GetAllWords()
    {
        return this.WordRepository.GetAllWords();
    }
}
